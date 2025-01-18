import { BaseNode } from './baseNode.js';
import { ActionService } from '../services/actionService.js';

export class ActionNode extends BaseNode {
  static async execute(node, context) {
    const action = node.data.action;
    let actionResult;

    try {
      switch (action.type) {
        case 'api_call':
          actionResult = await ActionService.handleApiCall(action, context);
          break;
        case 'set_variable':
          actionResult = await ActionService.handleSetVariable(action, context);
          break;
        default:
          actionResult = `Executed action: ${JSON.stringify(action)}`;
      }
    } catch (error) {
      actionResult = `Action failed: ${error.message}`;
    }

    return this.createResult('action', actionResult, node.id);
  }
}