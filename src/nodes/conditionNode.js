import { BaseNode } from './baseNode.js';
import { ContextService } from '../services/contextService.js';

export class ConditionNode extends BaseNode {
  static execute(node, context) {
    const result = ContextService.evaluateCondition(node.data.condition, context);
    return this.createResult('condition', result, node.id);
  }
}