export class AgentStorage {
  constructor() {
    this.agents = new Map();
  }

  createAgent(agentData) {
    const id = crypto.randomUUID();
    const agent = {
      id,
      ...agentData,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    this.agents.set(id, agent);
    return agent;
  }

  getAgent(id) {
    return this.agents.get(id);
  }

  updateAgent(id, data) {
    const agent = this.agents.get(id);
    if (!agent) return null;

    const updatedAgent = {
      ...agent,
      ...data,
      updated: new Date().toISOString()
    };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  deleteAgent(id) {
    return this.agents.delete(id);
  }

  getAllAgents() {
    return Array.from(this.agents.values());
  }
}