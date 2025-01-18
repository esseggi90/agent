import { MessageNode } from './nodes/messageNode.js';
import { ConditionNode } from './nodes/conditionNode.js';
import { InputNode } from './nodes/inputNode.js';
import { ActionNode } from './nodes/actionNode.js';
import { GraphService } from './services/graphService.js';
import { ContextService } from './services/contextService.js';
import { WorkflowError } from './interfaces/node.js';

export class WorkflowEngine {
  constructor() {
    this.nodeExecutors = {
      'message': MessageNode,
      'condition': ConditionNode,
      'input': InputNode,
      'action': ActionNode
    };
    this.nodeExecutionCounts = new Map();
  }

  async executeWorkflow(workflow, context = {}, startFromNodeId = null) {
    try {
      if (!workflow || !workflow.nodes || !workflow.edges) {
        throw new Error('Invalid workflow structure');
      }
      
      ContextService.validateContext(context);
      GraphService.validateGraph(workflow.nodes, workflow.edges);

      const { nodes, edges } = workflow;
      let currentNode = startFromNodeId 
        ? nodes.find(node => node.id === startFromNodeId)
        : GraphService.findStartNode(nodes, edges);

      const executionResult = [];

      while (currentNode) {
        // Increment execution count for current node
        const currentCount = this.nodeExecutionCounts.get(currentNode.id) || 0;
        this.nodeExecutionCounts.set(currentNode.id, currentCount + 1);

        const result = await this.executeNode(currentNode, context);
        result.executionCount = this.nodeExecutionCounts.get(currentNode.id);
        executionResult.push(result);

        if (result.error) {
          break;
        }

        if (result.waitForInput) {
          break;
        }

        currentNode = currentNode.type === 'condition'
          ? GraphService.findNextNodeAfterCondition(currentNode.id, nodes, edges, result.output)
          : GraphService.findNextNode(currentNode.id, nodes, edges);
      }

      return {
        results: executionResult,
        context,
        completed: !executionResult[executionResult.length - 1]?.waitForInput,
        nodeExecutionCounts: Object.fromEntries(this.nodeExecutionCounts)
      };
    } catch (error) {
      if (error instanceof WorkflowError) {
        throw error;
      }
      throw new WorkflowError(error.message, null, 'WORKFLOW_EXECUTION_ERROR');
    }
  }

  async executeNode(node, context) {
    try {
      const executor = this.nodeExecutors[node.type];
      if (!executor) {
        throw new WorkflowError(`Unknown node type: ${node.type}`, node.id, 'UNKNOWN_NODE_TYPE');
      }

      return await executor.execute(node, context);
    } catch (error) {
      return {
        type: node.type,
        nodeId: node.id,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  registerNodeExecutor(type, executor) {
    if (typeof executor.execute !== 'function') {
      throw new Error('Invalid node executor: must have execute method');
    }
    this.nodeExecutors[type] = executor;
  }

  resetExecutionCounts() {
    this.nodeExecutionCounts.clear();
  }
}