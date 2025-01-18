import express from 'express';
import cors from 'cors';
import { WorkflowEngine } from './workflowEngine.js';
import { WorkflowStorage } from './workflowStorage.js';
import { ChatSessionStorage } from './chatSessionStorage.js';
import { AgentStorage } from './agentStorage.js';
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
const agentStorage = new AgentStorage();

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Agent Management Endpoints
app.post('/api/agents', (req, res) => {
  try {
    const agent = agentStorage.createAgent(req.body);
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/agents', (req, res) => {
  const agents = agentStorage.getAllAgents();
  res.json(agents);
});

app.get('/api/agents/:agentId', (req, res) => {
  const agent = agentStorage.getAgent(req.params.agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

app.put('/api/agents/:agentId', (req, res) => {
  const updatedAgent = agentStorage.updateAgent(req.params.agentId, req.body);
  if (!updatedAgent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(updatedAgent);
});

app.delete('/api/agents/:agentId', (req, res) => {
  const deleted = agentStorage.deleteAgent(req.params.agentId);
  if (!deleted) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.status(204).send();
});

// Workflow Management Endpoints
app.post('/api/agents/:agentId/workflows', (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = agentStorage.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const workflowId = workflowStorage.saveWorkflow(req.body, agentId);
    res.status(201).json({ id: workflowId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/agents/:agentId/workflows', (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = agentStorage.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const workflows = workflowStorage.getAgentWorkflows(agentId);
    res.json(workflows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Chat Session Endpoints
app.post('/api/agents/:agentId/chat', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { chatId, userId, input } = req.body;

    const agent = agentStorage.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Get agent's workflows
    const workflows = workflowStorage.getAgentWorkflows(agentId);
    if (workflows.length === 0) {
      return res.status(400).json({ error: 'Agent has no workflows' });
    }

    // Get existing session or create new one
    let session = chatSessionStorage.getSession(chatId);
    let result;

    if (!session || !input) {
      // Start new session with first workflow
      const workflow = workflows[0].workflow;
      const sessionInfo = new SessionInfo(chatId, userId, agentId);
      session = new WorkflowSession(sessionInfo, workflows[0].id);
      
      result = await workflowEngine.executeWorkflow(workflow, {});
      
      chatSessionStorage.saveSession(chatId, {
        session,
        lastNodeId: result.results[result.results.length - 1].nodeId,
        context: result.context
      });
    } else {
      // Continue existing session
      const workflow = workflowStorage.getWorkflow(session.workflowId);
      const context = { ...session.context, lastInput: input };
      
      result = await workflowEngine.executeWorkflow(
        workflow,
        context,
        session.lastNodeId
      );
      
      chatSessionStorage.saveSession(chatId, {
        session,
        lastNodeId: result.results[result.results.length - 1].nodeId,
        context: result.context
      });
    }

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