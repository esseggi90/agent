export class NodeResult {
  constructor(type, output, nodeId, waitForInput = false, error = null) {
    this.type = type;
    this.output = output;
    this.nodeId = nodeId;
    this.waitForInput = waitForInput;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }
}

export class NodeData {
  constructor(data) {
    this.data = this.validateData(data);
  }

  validateData(data) {
    if (!data) {
      throw new Error('Node data cannot be null or undefined');
    }
    return data;
  }
}

export class WorkflowError extends Error {
  constructor(message, nodeId, type) {
    super(message);
    this.nodeId = nodeId;
    this.type = type;
    this.name = 'WorkflowError';
  }
}