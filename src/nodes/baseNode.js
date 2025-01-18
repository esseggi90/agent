import { NodeResult } from '../interfaces/node.js';

export class BaseNode {
  static createResult(type, output, nodeId, waitForInput = false) {
    return new NodeResult(type, output, nodeId, waitForInput);
  }
}