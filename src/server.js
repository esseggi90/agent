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

// Serve i file statici del frontend
app.use(express.static(join(__dirname, '../dist')));

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

// ... [resto delle route API] ...

// Serve l'app React per qualsiasi altra route
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;