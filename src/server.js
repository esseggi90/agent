import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './lib/firebase-admin.js';
import { WorkflowEngine } from './workflowEngine.js';
import { ChatSessionStorage } from './chatSessionStorage.js';
import { WorkflowError } from './interfaces/node.js';
import { SessionInfo, WorkflowSession } from './interfaces/session.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const workflowEngine = new WorkflowEngine();
const chatSessionStorage = new ChatSessionStorage();

// Admin authentication middleware
const requireAdminAuth = (req, res, next) => {
  const adminSecret = req.headers['x-admin-secret'];
  
  if (!adminSecret || adminSecret !== process.env.ADMIN_API_SECRET) {
    return res.status(401).json({ 
      error: 'Invalid admin credentials'
    });
  }
  
  next();
};

// API Key middleware
const requireApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key is required. Please include it in the X-API-Key header.' 
    });
  }

  const keyData = await db.validateApiKey(apiKey);
  if (!keyData) {
    return res.status(401).json({ 
      error: 'Invalid API key.' 
    });
  }

  req.userId = keyData.userId;
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Key management endpoints
app.post('/api/keys', requireAdminAuth, async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const apiKey = await db.generateApiKey(userId);
    res.status(201).json({ apiKey });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({ error: error.message });
  }
});

// Protected API endpoints
app.get('/api/agents', requireApiKey, async (req, res) => {
  try {
    const agents = await db.query('agents');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agents', requireApiKey, async (req, res) => {
  try {
    const agent = await db.createDocument('agents', req.body);
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/agents/:agentId', requireApiKey, async (req, res) => {
  try {
    const agent = await db.getDocument('agents', req.params.agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/agents/:agentId', requireApiKey, async (req, res) => {
  try {
    const agent = await db.updateDocument('agents', req.params.agentId, req.body);
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/agents/:agentId', requireApiKey, async (req, res) => {
  try {
    await db.deleteDocument('agents', req.params.agentId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat Session Endpoints
app.post('/api/agents/:agentId/chat', requireApiKey, async (req, res) => {
  try {
    const { agentId } = req.params;
    const { chatId, userId, input } = req.body;

    const agent = await db.getDocument('agents', agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Get agent's workflows from subcollection
    const workflowsRef = db.collections.agents().doc(agentId).collection('workflows');
    const workflowsSnapshot = await workflowsRef.get();
    const workflows = workflowsSnapshot.docs.map(doc => ({
      id: doc.id,
      workflow: doc.data()
    }));

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
      const workflowDoc = await workflowsRef.doc(session.workflowId).get();
      const workflow = workflowDoc.data();
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

app.get('/api/sessions/:chatId', requireApiKey, (req, res) => {
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
