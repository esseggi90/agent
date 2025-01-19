import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './lib/firebase-admin.js';
import { WorkflowEngine } from './workflowEngine.js';
import { ChatSessionStorage } from './chatSessionStorage.js';
import { WorkflowError } from './interfaces/node.js';
import { SessionInfo, WorkflowSession } from './interfaces/session.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Use import.meta.url instead of __filename
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

const workflowEngine = new WorkflowEngine();
const chatSessionStorage = new ChatSessionStorage();

// Rest of the code remains the same...