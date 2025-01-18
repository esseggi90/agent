import express from 'express';
import cors from 'cors';
import { WorkflowEngine } from './workflowEngine.js';
import { WorkflowStorage } from './workflowStorage.js';
import { ChatSessionStorage } from './chatSessionStorage.js';
import { WorkflowError } from './interfaces/node.js';
import { SessionInfo, WorkflowSession } from './interfaces/session.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const workflowStorage = new WorkflowStorage();
const workflowEngine = new WorkflowEngine();
const chatSessionStorage = new ChatSessionStorage();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.post('/api/agents/:agentId/workflows', (req, res) => {
  try {
    const { agentId } = req.params;
    const workflowId = workflowStorage.saveWorkflow(req.body, agentId);
    res.status(201).json({ id: workflowId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/agents/:agentId/workflows', (req, res) => {
  try {
    const { agentId } = req.params;
    const workflows = workflowStorage.getAgentWorkflows(agentId);
    res.json(workflows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/workflows/:id', (req, res) => {
  const workflow = workflowStorage.getWorkflow(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json(workflow);
});

app.post('/api/workflows/:id/execute', async (req, res) => {
  try {
    const workflow = workflowStorage.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const { chatId, userId, agentId } = req.body;
    const sessionInfo = new SessionInfo(chatId, userId, agentId);
    const session = new WorkflowSession(sessionInfo, req.params.id);
    
    const result = await workflowEngine.executeWorkflow(workflow, req.body.context || {});
    
    chatSessionStorage.saveSession(chatId, {
      session,
      lastNodeId: result.results[result.results.length - 1].nodeId,
      context: result.context
    });
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/workflows/:id/continue', async (req, res) => {
  try {
    const workflow = workflowStorage.getWorkflow(req.params.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const { chatId, userId, agentId, input, lastNodeId } = req.body;
    const context = { ...req.body.context, lastInput: input };
    
    const result = await workflowEngine.executeWorkflow(workflow, context, lastNodeId);
    
    chatSessionStorage.saveSession(chatId, {
      session: new WorkflowSession(new SessionInfo(chatId, userId, agentId), req.params.id),
      lastNodeId: result.results[result.results.length - 1].nodeId,
      context: result.context
    });
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/sessions/:chatId', (req, res) => {
  const session = chatSessionStorage.getSession(req.params.chatId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// Catch all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});