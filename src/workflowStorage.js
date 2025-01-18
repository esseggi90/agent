export class WorkflowStorage {
  constructor() {
    this.workflows = new Map();
    this.agentWorkflows = new Map(); // Map to store agent -> workflows relationship
  }

  saveWorkflow(workflow, agentId) {
    if (!agentId) {
      throw new Error('Agent ID is required to save a workflow');
    }

    const id = crypto.randomUUID();
    this.workflows.set(id, workflow);

    // Store the workflow ID under the agent
    if (!this.agentWorkflows.has(agentId)) {
      this.agentWorkflows.set(agentId, new Set());
    }
    this.agentWorkflows.get(agentId).add(id);

    return id;
  }

  getWorkflow(id) {
    return this.workflows.get(id);
  }

  getAgentWorkflows(agentId) {
    const workflowIds = this.agentWorkflows.get(agentId) || new Set();
    return Array.from(workflowIds).map(id => ({
      id,
      workflow: this.workflows.get(id)
    }));
  }

  updateWorkflow(id, workflow, agentId) {
    if (!this.workflows.has(id)) {
      return false;
    }
    this.workflows.set(id, workflow);
    return true;
  }

  deleteWorkflow(id, agentId) {
    if (!agentId) {
      throw new Error('Agent ID is required to delete a workflow');
    }

    // Remove from workflows map
    const deleted = this.workflows.delete(id);

    // Remove from agent's workflows
    const agentWorkflows = this.agentWorkflows.get(agentId);
    if (agentWorkflows) {
      agentWorkflows.delete(id);
    }

    return deleted;
  }
}