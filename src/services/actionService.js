export class ActionService {
  static async handleApiCall(action, context) {
    if (!action.url) {
      throw new Error('API URL is required');
    }

    try {
      const response = await fetch(action.url, {
        method: action.method || 'GET',
        headers: action.headers || {},
        body: action.body ? JSON.stringify(action.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`API call failed: ${error.message}`);
    }
  }

  static async handleSetVariable(action, context) {
    if (!action.variable) {
      throw new Error('Variable name is required for set_variable action');
    }

    const value = action.value !== undefined ? action.value : null;
    return ContextService.setVariable(context, action.variable, value);
  }

  static validateAction(action) {
    if (!action || !action.type) {
      throw new Error('Invalid action: type is required');
    }

    switch (action.type) {
      case 'api_call':
        if (!action.url) {
          throw new Error('Invalid api_call action: url is required');
        }
        break;
      case 'set_variable':
        if (!action.variable) {
          throw new Error('Invalid set_variable action: variable is required');
        }
        break;
      default:
        throw new Error(`Unsupported action type: ${action.type}`);
    }
  }
}