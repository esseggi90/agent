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

// Admin middleware for API key generation
const requireAdminSecret = (req, res, next) => {
  const adminSecret = req.headers['x-admin-secret'];
  
  if (!adminSecret || adminSecret !== process.env.ADMIN_API_SECRET) {
    return res.status(401).json({ 
      error: 'Valid admin secret is required in X-Admin-Secret header for this operation.' 
    });
  }
  
  next();
};

// API Key management endpoints
app.post('/api/keys', requireAdminSecret, async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const apiKey = await db.generateApiKey(userId);
    res.status(201).json({ apiKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rest of the server code remains the same...