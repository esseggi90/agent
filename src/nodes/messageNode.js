import { BaseNode } from './baseNode.js';
import { ContextService } from '../services/contextService.js';

export class MessageNode extends BaseNode {
  static execute(node, context) {
    const message = ContextService.replaceVariables(node.data.message, context);
    return this.createResult('message', message, node.id);
  }
}