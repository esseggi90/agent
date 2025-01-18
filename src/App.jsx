import React, { useState } from 'react';
import { Container, Title, TextInput, Button, Paper, Stack, Text, JsonInput, Loader } from '@mantine/core';

// Usa l'URL relativo per le API quando siamo in produzione
const API_URL = '';

function App() {
  const [workflowId, setWorkflowId] = useState('');
  const [chatId, setChatId] = useState(`chat_${Date.now()}`);
  const [userId, setUserId] = useState('user_test');
  const [agentId, setAgentId] = useState('agent_test');
  const [workflowData, setWorkflowData] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const createWorkflow = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: workflowData
      });
      const data = await response.json();
      setWorkflowId(data.id);
      setMessages(prev => [...prev, { type: 'system', content: `Workflow created with ID: ${data.id}` }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  // ... [resto del componente rimane uguale] ...
}

export default App;