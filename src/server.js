import express from 'express';
import cors from 'cors';
import { WorkflowEngine } from './workflowEngine.js';
import { WorkflowStorage } from './workflowStorage.js';
import { ChatSessionStorage } from './chatSessionStorage.js';
import { WorkflowError } from './interfaces/node.js';
import { SessionInfo, WorkflowSession } from './interfaces/session.js';

const app = express();
app.use(cors());
app.use(express.json());

const workflowStorage = new WorkflowStorage();
const workflowEngine = new WorkflowEngine();
const chatSessionStorage = new ChatSessionStorage();

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Middleware per validare le informazioni della sessione
const validateSession = (req, res, next) => {
  try {
    const { chatId, userId, agentId } = req.body;
    if (!chatId || !userId) {
      return res.status(400).json({
        error: 'Missing required session information',
        message: 'chatId and userId are required'
      });
    }
    req.sessionInfo = new SessionInfo(chatId, userId, agentId);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Invalid session information',
      message: error.message
    });
  }
};

// Formatta la risposta in base al tipo di nodo
const formatResponse = (result) => {
  const lastNode = result.results[result.results.length - 1];
  
  if (lastNode.type === 'input') {
    return {
      type: 'input',
      question: lastNode.output
    };
  }
  
  if (lastNode.type === 'message') {
    return {
      type: 'message',
      message: lastNode.output
    };
  }
  
  return lastNode;
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof WorkflowError) {
    res.status(400).json({
      error: err.message,
      type: err.type,
      nodeId: err.nodeId
    });
  } else {
    res.status(500).json({
      error: 'Internal server error',
      message: err.message
    });
  }
});

// Create a new workflow
app.post('/workflows', (req, res) => {
  try {
    const workflow = req.body;
    const id = workflowStorage.saveWorkflow(workflow);
    res.json({ id, message: 'Workflow created successfully' });
  } catch (error) {
    next(error);
  }
});

// Get a workflow by ID
app.get('/workflows/:id', (req, res) => {
  try {
    const workflow = workflowStorage.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    next(error);
  }
});

// Execute a workflow
app.post('/workflows/:id/execute', validateSession, async (req, res, next) => {
  try {
    const workflow = workflowStorage.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const session = new WorkflowSession(req.sessionInfo, req.params.id);
    const context = { ...req.body.context, session: session.toJSON() };
    
    const result = await workflowEngine.executeWorkflow(workflow, context);
    
    chatSessionStorage.updateSessionNode(
      req.sessionInfo.chatId,
      result.results[result.results.length - 1].nodeId,
      context
    );
    
    res.json(formatResponse(result));
  } catch (error) {
    next(error);
  }
});

// Continue workflow after input
app.post('/workflows/:id/continue', validateSession, async (req, res, next) => {
  try {
    const workflow = workflowStorage.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const { context, input, lastNodeId } = req.body;
    
    const session = new WorkflowSession(req.sessionInfo, req.params.id);
    const updatedContext = {
      ...context,
      lastInput: input,
      session: session.toJSON()
    };

    const result = await workflowEngine.executeWorkflow(workflow, updatedContext, lastNodeId);
    
    chatSessionStorage.updateSessionNode(
      req.sessionInfo.chatId,
      result.results[result.results.length - 1].nodeId,
      updatedContext
    );
    
    res.json(formatResponse(result));
  } catch (error) {
    next(error);
  }
});

// Get session status
app.get('/sessions/:chatId', (req, res) => {
  const session = chatSessionStorage.getSession(req.params.chatId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;