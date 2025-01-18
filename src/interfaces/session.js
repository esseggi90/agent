export class SessionInfo {
  constructor(chatId, userId, agentId) {
    if (!chatId) throw new Error('chatId is required');
    if (!userId) throw new Error('userId is required');
    
    this.chatId = chatId;
    this.userId = userId;
    this.agentId = agentId;
    this.startTime = new Date().toISOString();
  }

  toJSON() {
    return {
      chatId: this.chatId,
      userId: this.userId,
      agentId: this.agentId,
      startTime: this.startTime
    };
  }
}

export class WorkflowSession {
  constructor(sessionInfo, workflowId) {
    this.sessionInfo = sessionInfo;
    this.workflowId = workflowId;
    this.context = {};
  }

  toJSON() {
    return {
      session: this.sessionInfo.toJSON(),
      workflowId: this.workflowId,
      context: this.context
    };
  }
}