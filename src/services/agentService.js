import { db } from './firebaseAdmin.js';
import { CacheService } from './cacheService.js';

export class AgentService {
  static async getAgent(agentId) {
    const cacheKey = CacheService.getAgentCacheKey(agentId);
    
    return CacheService.getOrSet(cacheKey, async () => {
      const doc = await db.collection('agents').doc(agentId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    });
  }

  static async createAgent(data) {
    const docRef = db.collection('agents').doc();
    const agentData = {
      id: docRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await docRef.set(agentData);
    
    // Cache the new agent
    const cacheKey = CacheService.getAgentCacheKey(docRef.id);
    CacheService.set(cacheKey, agentData);

    return agentData;
  }

  static async updateAgent(agentId, data) {
    const agentRef = db.collection('agents').doc(agentId);
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    await agentRef.update(updateData);
    
    // Invalidate cache
    CacheService.invalidateAgentCache(agentId);

    return { id: agentId, ...updateData };
  }

  static async deleteAgent(agentId) {
    await db.collection('agents').doc(agentId).delete();
    
    // Invalidate cache
    CacheService.invalidateAgentCache(agentId);

    return true;
  }

  static async getAgentsByWorkspace(workspaceId) {
    const cacheKey = `workspace-agents:${workspaceId}`;
    
    return CacheService.getOrSet(cacheKey, async () => {
      const snapshot = await db.collection('agents')
        .where('workspaceId', '==', workspaceId)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  }
}