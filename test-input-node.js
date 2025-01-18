import { WorkflowEngine } from './src/workflowEngine.js';

// Workflow corretto: le domande sono nei nodi message
const workflow = {
  nodes: [
    {
      id: "welcome",
      type: "message",
      data: {
        message: "Come ti chiami?"
      }
    },
    {
      id: "get_name",
      type: "input",
      data: {}
    },
    {
      id: "ask_age",
      type: "message",
      data: {
        message: "Ciao {lastInput}! Quanti anni hai?"
      }
    },
    {
      id: "get_age",
      type: "input",
      data: {}
    },
    {
      id: "final",
      type: "message",
      data: {
        message: "Ho capito, hai {lastInput} anni!"
      }
    }
  ],
  edges: [
    { source: "welcome", target: "get_name" },
    { source: "get_name", target: "ask_age" },
    { source: "ask_age", target: "get_age" },
    { source: "get_age", target: "final" }
  ]
};

// Test del workflow
async function testWorkflow() {
  const engine = new WorkflowEngine();
  
  console.log("=== Test del workflow ===\n");
  
  // Prima esecuzione - mostra il messaggio di benvenuto
  console.log("1. Avvio workflow");
  let result = await engine.executeWorkflow(workflow);
  console.log("Bot:", result.results[0].output);  // "Come ti chiami?"
  
  // Rispondiamo con il nome
  console.log("\n2. Utente risponde: Mario");
  result = await engine.executeWorkflow(
    workflow,
    { lastInput: "Mario" },
    "ask_age"
  );
  console.log("Bot:", result.results[0].output);  // "Ciao Mario! Quanti anni hai?"
  
  // Rispondiamo con l'età
  console.log("\n3. Utente risponde: 25");
  result = await engine.executeWorkflow(
    workflow,
    { lastInput: "25" },
    "final"
  );
  console.log("Bot:", result.results[0].output);  // "Ho capito, hai 25 anni!"
}

testWorkflow();