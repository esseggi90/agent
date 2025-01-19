import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Ensure all required environment variables are present
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Process the private key - handle both formats
const privateKey = process.env.FIREBASE_PRIVATE_KEY.includes('\\n') 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : process.env.FIREBASE_PRIVATE_KEY;

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: privateKey,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
};

let app;
try {
  app = initializeApp({
    credential: cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  console.error('Service Account:', {
    ...serviceAccount,
    private_key: '[REDACTED]'
  });
  throw error;
}

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);

// Helper functions for common database operations
export const db = {
  // Collection references
  collections: {
    users: () => adminDb.collection('users'),
    workspaces: () => adminDb.collection('workspaces'),
    agents: () => adminDb.collection('agents'),
    apiKeys: () => adminDb.collection('api_keys'),
  },

  // API Key operations
  async generateApiKey(userId) {
    if (!userId) {
      throw new Error('userId is required');
    }

    try {
      // First verify the user exists
      const userDoc = await this.collections.users().doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      // Generate a new API key
      const apiKey = crypto.randomBytes(32).toString('hex');
      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
      
      // Create the api_keys collection if it doesn't exist and add the new key
      await this.collections.apiKeys().doc(hashedKey).set({
        userId,
        createdAt: new Date(),
        lastUsed: null,
        isActive: true
      });

      return apiKey;
    } catch (error) {
      console.error('Error in generateApiKey:', error);
      throw new Error('Failed to generate API key');
    }
  },

  async validateApiKey(apiKey) {
    if (!apiKey) return null;
    
    try {
      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
      const keyDoc = await this.collections.apiKeys().doc(hashedKey).get();
      
      if (!keyDoc.exists || !keyDoc.data().isActive) {
        return null;
      }
      
      // Update last used timestamp
      await keyDoc.ref.update({ lastUsed: new Date() });
      
      return keyDoc.data();
    } catch (error) {
      console.error('Error in validateApiKey:', error);
      return null;
    }
  },

  // Common operations
  async getDocument(collection, id) {
    const doc = await this.collections[collection]().doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async createDocument(collection, data, id = null) {
    const ref = id 
      ? this.collections[collection]().doc(id)
      : this.collections[collection]().doc();
    
    await ref.set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return { id: ref.id, ...data };
  },

  async updateDocument(collection, id, data) {
    const ref = this.collections[collection]().doc(id);
    await ref.update({
      ...data,
      updatedAt: new Date()
    });
    return { id, ...data };
  },

  async deleteDocument(collection, id) {
    await this.collections[collection]().doc(id).delete();
    return true;
  },

  async query(collection, conditions = []) {
    let query = this.collections[collection]();
    
    conditions.forEach(({ field, operator, value }) => {
      query = query.where(field, operator, value);
    });

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};

export default app;
