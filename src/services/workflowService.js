import { db } from './firebaseAdmin.js';
import { CacheService } from './cacheService.js';

export class WorkflowService {
  static async getWorkflow(workflowId) {
    const cacheKey = CacheService.getWorkflowCacheKey(workflowId);
    
    return CacheService.getOrSet(cacheKey, async () => {
      const doc = await db.collection('workflows').doc(workflowId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    });
  }

  static async getAgentWorkflows(agentId) {
    const cacheKey = CacheService.getAgentWorkflowsCacheKey(agentId);
    
    return CacheService.getOrSet(cacheKey, async () => {
      const snapshot = await db.collection('agents')
        .doc(agentId)
        .collection('workflows')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  }

  static async createWorkflow(agentId, data) {
    const workflowRef = db.collection('agents')
      .doc(agentId)
      .collection('workflows')
      .doc();

    const workflowData = {
      id: workflowRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await workflowRef.set(workflowData);
    
    // Invalidate agent workflows cache
    CacheService.del(CacheService.getAgentWorkflowsCacheKey(agentId));

    return workflowData;
  }

  static async updateWorkflow(agentId, workflowId, data) {
    const workflowRef = db.collection('agents')
      .doc(agentId)
      .collection('workflows')
      .doc(workflowId);

    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    await workflowRef.update(updateData);
    
    // Invalidate caches
    CacheService.del(CacheService.getWorkflowCacheKey(workflowId));
    CacheService.del(CacheService.getAgentWorkflowsCacheKey(agentId));

    return { id: workflowId, ...updateData };
  }

  static async deleteWorkflow(agentId, workflowId) {
    await db.collection('agents')
      .doc(agentId)
      .collection('workflows')
      .doc(workflowId)
      .delete();
    
    // Invalidate caches
    CacheService.del(CacheService.getWorkflowCacheKey(workflowId));
    CacheService.del(CacheService.getAgentWorkflowsCacheKey(agentId));

    return true;
  }
}