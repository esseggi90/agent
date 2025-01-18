import React, { useState } from 'react';
import { Container, Title, TextInput, Button, Paper, Stack, Text, JsonInput } from '@mantine/core';

function App() {
  const [workflowId, setWorkflowId] = useState('');
  const [chatId, setChatId] = useState(`chat_${Date.now()}`);
  const [userId, setUserId] = useState('user_test');
  const [agentId, setAgentId] = useState('agent_test');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastNodeId, setLastNodeId] = useState(null);
  const [context, setContext] = useState({});

  const handleSendMessage = async () => {
    if (!workflowId) {
      setMessages(prev => [...prev, { type: 'error', content: 'Please enter a workflow ID' }]);
      return;
    }

    setLoading(true);
    try {
      const endpoint = lastNodeId ? 'continue' : 'execute';
      const response = await fetch(`/api/workflows/${workflowId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          userId,
          agentId,
          input,
          lastNodeId,
          context,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Add messages from results
      data.results.forEach(result => {
        if (result.type === 'message') {
          setMessages(prev => [...prev, { type: 'bot', content: result.output }]);
        }
      });

      // Update context and last node ID
      setContext(data.context);
      const lastResult = data.results[data.results.length - 1];
      setLastNodeId(lastResult.nodeId);

      // Clear input if it was sent
      if (input) {
        setInput('');
        setMessages(prev => [...prev, { type: 'user', content: input }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper shadow="sm" p="md" withBorder>
        <Stack spacing="md">
          <Title order={1}>Workflow Tester</Title>
          
          <TextInput
            label="Workflow ID"
            value={workflowId}
            onChange={(e) => setWorkflowId(e.target.value)}
            placeholder="Enter workflow ID"
          />
          
          <TextInput
            label="Chat ID"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            disabled
          />
          
          <TextInput
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          
          <TextInput
            label="Agent ID"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          />
          
          <TextInput
            label="Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          
          <Button onClick={handleSendMessage} loading={loading}>
            Send Message
          </Button>
          
          <Paper withBorder p="md">
            <Title order={3} mb="md">Messages</Title>
            {messages.length === 0 ? (
              <Text color="dimmed">No messages yet</Text>
            ) : (
              messages.map((msg, index) => (
                <Text 
                  key={index} 
                  mb="xs"
                  color={msg.type === 'error' ? 'red' : msg.type === 'user' ? 'blue' : 'black'}
                >
                  {msg.type === 'user' ? 'You: ' : msg.type === 'bot' ? 'Bot: ' : 'Error: '}
                  {msg.content}
                </Text>
              ))
            )}
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;