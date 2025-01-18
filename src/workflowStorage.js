export class WorkflowStorage {
  constructor() {
    this.workflows = new Map();
  }

  saveWorkflow(workflow) {
    const id = crypto.randomUUID();
    this.workflows.set(id, workflow);
    return id;
  }

  getWorkflow(id) {
    return this.workflows.get(id);
  }

  updateWorkflow(id, workflow) {
    if (!this.workflows.has(id)) {
      return false;
    }
    this.workflows.set(id, workflow);
    return true;
  }

  deleteWorkflow(id) {
    return this.workflows.delete(id);
  }
}