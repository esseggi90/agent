export class ChatSessionStorage {
  constructor() {
    this.sessions = new Map();
  }

  saveSession(chatId, data) {
    this.sessions.set(chatId, {
      ...data,
      lastUpdated: new Date().toISOString()
    });
  }

  getSession(chatId) {
    return this.sessions.get(chatId);
  }

  updateSessionNode(chatId, nodeId, context) {
    const session = this.sessions.get(chatId) || {};
    this.sessions.set(chatId, {
      ...session,
      currentNodeId: nodeId,
      context: context,
      lastUpdated: new Date().toISOString()
    });
  }

  deleteSession(chatId) {
    return this.sessions.delete(chatId);
  }
}