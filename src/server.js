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
      const workflow = workflows[0];
      const sessionInfo = new SessionInfo(chatId, userId, agentId);
      session = new WorkflowSession(sessionInfo, workflow.id);
      
      result = await workflowEngine.executeWorkflow(workflow.workflow, {});
      
      chatSessionStorage.saveSession(chatId, {
        session,
        lastNodeId: result.results[result.results.length - 1].nodeId,
        context: result.context
      });
    } else {
      // Continue existing session
      const workflow = workflowStorage.getWorkflow(session.workflowId);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      const context = { ...session.context, lastInput: input };
      const lastNode = session.lastNodeId;
      
      result = await workflowEngine.executeWorkflow(
        workflow,
        context,
        lastNode
      );
      
      chatSessionStorage.saveSession(chatId, {
        session,
        lastNodeId: result.results[result.results.length - 1].nodeId,
        context: result.context
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(400).json({ error: error.message });
  }
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

// Workflow Management Endpoints
app.post('/api/agents/:agentId/workflows', (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = agentStorage.getAgent(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Extract workflow from request body
    const workflow = req.body.workflow || req.body;
    if (!workflow || !workflow.nodes || !workflow.edges) {
      return res.status(400).json({ error: 'Invalid workflow structure' });
    }

    const workflowId = workflowStorage.saveWorkflow(workflow, agentId);
    res.status(201).json({ id: workflowId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});