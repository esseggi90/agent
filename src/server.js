import express from 'express';
import cors from 'cors';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase.js';
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

// Get agent workflows
app.get('/api/agents/:agentId/workflows', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // First check if agent exists
    const agentRef = doc(db, 'agents', agentId);
    const agentSnap = await getDoc(agentRef);
    
    if (!agentSnap.exists()) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Get workflows from subcollection
    const workflowsRef = collection(db, 'agents', agentId, 'workflows');
    const workflowsSnap = await getDocs(workflowsRef);
    
    const workflows = workflowsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
});

// Rest of your existing endpoints...

// Catch all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});