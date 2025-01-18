import express from 'express';
const app = express();
app.use(express.json());

// Simula le chiamate API
async function simulateApiCalls() {
  const workflowData = {
    nodes: [
      {
        id: "welcome",
        type: "message",
        data: {
          message: "Ciao! Come posso aiutarti?"
        }
      },
      {
        id: "get_request",
        type: "input",
        data: {}
      },
      {
        id: "response",
        type: "message",
        data: {
          message: "Hai detto: {lastInput}"
        }
      }
    ],
    edges: [
      { source: "welcome", target: "get_request" },
      { source: "get_request", target: "response" }
    ]
  };

  console.log("=== Simulazione chiamate API ===\n");

  // 1. Creiamo il workflow
  console.log("1. POST /workflows - Creazione workflow");
  let response = await fetch('http://localhost:3000/workflows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workflowData)
  });
  let result = await response.json();
  const workflowId = result.id;
  console.log('Risposta:', result);

  // Info sessione
  const sessionInfo = {
    chatId: "chat_123",
    userId: "user_456",
    agentId: "agent_789"
  };

  // 2. Avviamo il workflow
  console.log("\n2. POST /workflows/{id}/execute - Avvio workflow");
  response = await fetch(`http://localhost:3000/workflows/${workflowId}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      context: {},
      ...sessionInfo
    })
  });
  result = await response.json();
  console.log('Risposta:', result);

  // 3. Continuiamo il workflow con input utente
  console.log("\n3. POST /workflows/{id}/continue - Invio input utente");
  response = await fetch(`http://localhost:3000/workflows/${workflowId}/continue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      context: {},
      input: "Ho bisogno di assistenza",
      lastNodeId: "get_request",
      ...sessionInfo
    })
  });
  result = await response.json();
  console.log('Risposta:', result);

  // 4. Verifichiamo lo stato della sessione
  console.log("\n4. GET /sessions/{chatId} - Verifica stato sessione");
  response = await fetch(`http://localhost:3000/sessions/${sessionInfo.chatId}`);
  result = await response.json();
  console.log('Risposta:', result);
}

// Avvia il server e la simulazione
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  simulateApiCalls().catch(console.error);
});