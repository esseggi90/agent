import { BaseNode } from './baseNode.js';

export class InputNode extends BaseNode {
  static execute(node) {
    return this.createResult('input', null, node.id, true);
  }
}