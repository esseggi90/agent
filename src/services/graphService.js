export class GraphService {
  static validateGraph(nodes, edges) {
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      throw new Error('Invalid graph structure: nodes and edges must be arrays');
    }

    if (nodes.length === 0) {
      throw new Error('Graph must contain at least one node');
    }

    const startNodes = this.findStartNodes(nodes, edges);
    if (startNodes.length === 0) {
      throw new Error('Graph must have at least one start node');
    }
    if (startNodes.length > 1) {
      throw new Error('Graph must have exactly one start node');
    }

    return true;
  }

  static findStartNodes(nodes, edges) {
    const nodesWithIncoming = new Set(edges.map(edge => edge.target));
    return nodes.filter(node => !nodesWithIncoming.has(node.id));
  }

  static findStartNode(nodes, edges) {
    this.validateGraph(nodes, edges);
    return this.findStartNodes(nodes, edges)[0];
  }

  static findNextNode(currentNodeId, nodes, edges) {
    if (!currentNodeId) return null;
    
    const edge = edges.find(edge => edge.source === currentNodeId);
    if (!edge) return null;
    
    return nodes.find(node => node.id === edge.target);
  }

  static findNextNodeAfterCondition(conditionNodeId, nodes, edges, conditionResult) {
    if (!conditionNodeId) return null;
    
    const edge = edges.find(edge => {
      return edge.source === conditionNodeId && 
             (conditionResult ? edge.type !== 'false' : edge.type === 'false');
    });
    
    if (!edge) return null;
    return nodes.find(node => node.id === edge.target);
  }

  static getNodeConnections(nodeId, edges) {
    return {
      incoming: edges.filter(edge => edge.target === nodeId),
      outgoing: edges.filter(edge => edge.source === nodeId)
    };
  }
}