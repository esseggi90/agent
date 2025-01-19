import NodeCache from 'node-cache';

// Cache configuration
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false // Store references instead of copies for better performance
});

// Cache keys
const CACHE_KEYS = {
  AGENT: 'agent:',
  WORKFLOW: 'workflow:',
  AGENT_WORKFLOWS: 'agent-workflows:',
  WORKSPACE: 'workspace:'
};

export class CacheService {
  static async getOrSet(key, fetchFn, ttl = 300) {
    let data = cache.get(key);
    
    if (data === undefined) {
      data = await fetchFn();
      if (data) {
        cache.set(key, data, ttl);
      }
    }
    
    return data;
  }

  static set(key, data, ttl = 300) {
    return cache.set(key, data, ttl);
  }

  static get(key) {
    return cache.get(key);
  }

  static del(key) {
    return cache.del(key);
  }

  static flush() {
    return cache.flushAll();
  }

  // Agent-specific methods
  static getAgentCacheKey(agentId) {
    return `${CACHE_KEYS.AGENT}${agentId}`;
  }

  static getWorkflowCacheKey(workflowId) {
    return `${CACHE_KEYS.WORKFLOW}${workflowId}`;
  }

  static getAgentWorkflowsCacheKey(agentId) {
    return `${CACHE_KEYS.AGENT_WORKFLOWS}${agentId}`;
  }

  static invalidateAgentCache(agentId) {
    const keys = [
      this.getAgentCacheKey(agentId),
      this.getAgentWorkflowsCacheKey(agentId)
    ];
    return cache.del(keys);
  }
}