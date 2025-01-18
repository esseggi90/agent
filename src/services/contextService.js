export class ContextService {
  static replaceVariables(text, context) {
    if (!text) return '';
    if (!context || typeof context !== 'object') return text;

    return Object.entries(context).reduce((result, [key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      return result.replace(regex, String(value));
    }, text);
  }

  static evaluateCondition(condition, context) {
    if (!condition) return false;
    
    try {
      const evalContext = { ...context };
      // Add safe utility functions
      evalContext.includes = (arr, item) => Array.isArray(arr) && arr.includes(item);
      evalContext.length = (val) => val?.length || 0;
      evalContext.isEmpty = (val) => !val || val.length === 0;
      
      const safeEval = new Function(...Object.keys(evalContext), `return ${condition}`);
      return Boolean(safeEval(...Object.values(evalContext)));
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  static setVariable(context, variable, value) {
    if (!variable) {
      throw new Error('Variable name is required');
    }
    
    const newContext = { ...context };
    newContext[variable] = value;
    return newContext;
  }

  static validateContext(context) {
    if (!context || typeof context !== 'object') {
      throw new Error('Invalid context: must be an object');
    }
    return true;
  }
}