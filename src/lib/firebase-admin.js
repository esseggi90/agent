import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
};

const app = initializeApp({
  credential: cert(serviceAccount)
});

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);

// Helper functions for common database operations
export const db = {
  // Collection references
  collections: {
    users: () => adminDb.collection('users'),
    workspaces: () => adminDb.collection('workspaces'),
    agents: () => adminDb.collection('agents'),
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