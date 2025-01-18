import express from 'express';
import { WorkflowEngine } from './src/workflowEngine.js';
import { WorkflowStorage } from './src/workflowStorage.js';

// Inizializza il server
const app = express();
app.use(express.json());

const workflowStorage = new WorkflowStorage();
const workflowEngine = new WorkflowEngine();

// Workflow di esempio per il supporto clienti
const workflow = {
  nodes: [
    {
      id: "welcome",
      type: "message",
      data: {
        message: "Welcome {session.userId}! How can I help you today?"
      }
    },
    {
      id: "get_issue",
      type: "input",
      data: {
        question: "Please describe your issue (technical/billing/other):"
      }
    },
    {
      id: "check_issue_type",
      type: "condition",
      data: {
        condition: "lastInput.toLowerCase().includes('technical')"
      }
    },
    {
      id: "technical_response",
      type: "message",
      data: {
        message: "For technical issues, please try restarting your device first. Did this solve your problem?"
      }
    },
    {
      id: "get_technical_feedback",
      type: "input",
      data: {
        question: "Did restarting solve your problem? (yes/no)"
      }
    },
    {
      id: "check_problem_solved",
      type: "condition",
      data: {
        condition: "lastInput.toLowerCase().includes('yes')"
      }
    },
    {
      id: "problem_solved",
      type: "message",
      data: {
        message: "Great! Let us know if you need anything else."
      }
    },
    {
      id: "escalate_technical",
      type: "message",
      data: {
        message: "I'll create a technical support ticket for further investigation. Your chat ID is: {session.chatId}"
      }
    },
    {
      id: "billing_response",
      type: "message",
      data: {
        message: "For billing inquiries, I'll need to fetch your account details."
      }
    },
    {
      id: "fetch_account",
      type: "action",
      data: {
        action: {
          type: "api_call",
          url: "http://localhost:3000/mock-api/account",
          method: "GET",
          headers: {
            "X-User-ID": "{session.userId}",
            "X-Chat-ID": "{session.chatId}"
          }
        }
      }
    },
    {
      id: "show_account_details",
      type: "message",
      data: {
        message: "Your account balance is: {accountBalance}"
      }
    }
  ],
  edges: [
    { source: "welcome", target: "get_issue" },
    { source: "get_issue", target: "check_issue_type" },
    { source: "check_issue_type", target: "technical_response", type: "true" },
    { source: "technical_response", target: "get_technical_feedback" },
    { source: "get_technical_feedback", target: "check_problem_solved" },
    { source: "check_problem_solved", target: "problem_solved", type: "true" },
    { source: "check_problem_solved", target: "escalate_technical", type: "false" },
    { source: "check_issue_type", target: "billing_response", type: "false" },
    { source: "billing_response", target: "fetch_account" },
    { source: "fetch_account", target: "show_account_details" }
  ]
};

// Salva il workflow
const workflowId = workflowStorage.saveWorkflow(workflow);
console.log('Workflow created with ID:', workflowId);

// Mock API per simulare chiamate esterne
app.get('/mock-api/account', (req, res) => {
  // Verifica le informazioni della sessione negli header
  const userId = req.headers['x-user-id'];
  const chatId = req.headers['x-chat-id'];
  
  console.log(`Account request for User: ${userId}, Chat: ${chatId}`);
  
  res.json({
    accountBalance: "$250.00",
    lastPayment: "2024-01-15",
    status: "active",
    userId: userId
  });
});

// Simula le chiamate del client
async function simulateClientCalls() {
  const sessionInfo = {
    chatId: "chat_" + Date.now(),
    userId: "user_123",
    agentId: "agent_456"
  };

  try {
    console.log('\n1. Starting new support session...');
    let response = await fetch('http://localhost:3000/workflows/' + workflowId + '/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: {},
        ...sessionInfo
      })
    });
    let result = await response.json();
    console.log('Server response:', JSON.stringify(result, null, 2));

    console.log('\n2. Client reports technical issue...');
    response = await fetch('http://localhost:3000/workflows/' + workflowId + '/continue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: result.context,
        input: "technical issue with login",
        lastNodeId: "get_issue",
        ...sessionInfo
      })
    });
    result = await response.json();
    console.log('Server response:', JSON.stringify(result, null, 2));

    console.log('\n3. Client responds about restart...');
    response = await fetch('http://localhost:3000/workflows/' + workflowId + '/continue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: result.context,
        input: "no, still having issues",
        lastNodeId: "get_technical_feedback",
        ...sessionInfo
      })
    });
    result = await response.json();
    console.log('Server response:', JSON.stringify(result, null, 2));

    // Nuova sessione per il billing
    const newSessionInfo = {
      chatId: "chat_" + Date.now(),
      userId: "user_789",
      agentId: "agent_456"
    };

    console.log('\n4. Starting new session for billing inquiry...');
    workflowEngine.resetExecutionCounts();
    response = await fetch('http://localhost:3000/workflows/' + workflowId + '/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: {},
        ...newSessionInfo
      })
    });
    result = await response.json();
    console.log('Server response:', JSON.stringify(result, null, 2));

    console.log('\n5. Client asks about billing...');
    response = await fetch('http://localhost:3000/workflows/' + workflowId + '/continue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: result.context,
        input: "billing question about my account",
        lastNodeId: "get_issue",
        ...newSessionInfo
      })
    });
    result = await response.json();
    console.log('Server response:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error during simulation:', error);
  }
}

// Avvia il server e la simulazione
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Starting client simulation...');
  simulateClientCalls();
});