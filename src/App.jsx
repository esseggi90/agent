import React, { useState, useEffect } from 'react';
import { Container, Title, Paper, Stack, Grid, Card, Text, Badge, Button, Group } from '@mantine/core';

function App() {
  const [workflows, setWorkflows] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In una vera implementazione, questi dati verrebbero caricati dalle API
    setWorkflows([
      {
        id: 'workflow-1',
        name: 'Customer Support',
        nodes: 8,
        status: 'active'
      },
      {
        id: 'workflow-2',
        name: 'Sales Process',
        nodes: 5,
        status: 'draft'
      }
    ]);

    setSessions([
      {
        chatId: 'chat_123',
        userId: 'user_456',
        startTime: new Date().toISOString(),
        status: 'active'
      }
    ]);
    
    setLoading(false);
  }, []);

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Title order={1}>Workflow Dashboard</Title>

        <Grid>
          {/* Statistiche generali */}
          <Grid.Col span={4}>
            <Paper shadow="sm" p="md" withBorder>
              <Stack>
                <Title order={3}>Overview</Title>
                <Group>
                  <div>
                    <Text size="xl" weight={700}>{workflows.length}</Text>
                    <Text size="sm" color="dimmed">Total Workflows</Text>
                  </div>
                  <div>
                    <Text size="xl" weight={700}>{sessions.length}</Text>
                    <Text size="sm" color="dimmed">Active Sessions</Text>
                  </div>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Quick Actions */}
          <Grid.Col span={8}>
            <Paper shadow="sm" p="md" withBorder>
              <Stack>
                <Title order={3}>Quick Actions</Title>
                <Group>
                  <Button variant="filled">Create Workflow</Button>
                  <Button variant="light">View All Sessions</Button>
                  <Button variant="light">System Status</Button>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Lista Workflows */}
        <Paper shadow="sm" p="md" withBorder>
          <Title order={2} mb="md">Workflows</Title>
          <Grid>
            {workflows.map(workflow => (
              <Grid.Col key={workflow.id} span={4}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Group position="apart" mb="xs">
                    <Text weight={500}>{workflow.name}</Text>
                    <Badge color={workflow.status === 'active' ? 'green' : 'yellow'}>
                      {workflow.status}
                    </Badge>
                  </Group>
                  <Text size="sm" color="dimmed" mb="md">
                    {workflow.nodes} nodes
                  </Text>
                  <Button variant="light" fullWidth>
                    View Details
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>

        {/* Sessioni Attive */}
        <Paper shadow="sm" p="md" withBorder>
          <Title order={2} mb="md">Active Sessions</Title>
          <Stack>
            {sessions.map(session => (
              <Card key={session.chatId} shadow="sm" padding="md" radius="md" withBorder>
                <Group position="apart">
                  <div>
                    <Text weight={500}>Session ID: {session.chatId}</Text>
                    <Text size="sm" color="dimmed">User: {session.userId}</Text>
                  </div>
                  <div>
                    <Badge color="blue">Active</Badge>
                    <Text size="xs" color="dimmed" mt={4}>
                      Started: {new Date(session.startTime).toLocaleString()}
                    </Text>
                  </div>
                </Group>
              </Card>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default App;