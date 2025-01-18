import { useState, useEffect } from 'react';
import type { Agent } from '../types';

export function useAgents(workspaceId: string) {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    setAgents([
      {
        id: '1',
        name: 'Customer Support Bot',
        description: 'AI-powered customer service assistant that handles common inquiries and support tickets.',
        icon: 'bot',
        coverImage: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2095&q=80',
        lastEdited: new Date(),
        status: 'active'
      },
      {
        id: '2',
        name: 'Sales Assistant',
        description: 'Intelligent sales bot that helps qualify leads and schedule demos.',
        icon: 'bot',
        lastEdited: new Date(),
        status: 'draft'
      }
    ]);
  }, [workspaceId]);

  const createAgent = async (data: Partial<Agent>) => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: data.name || '',
      description: data.description || '',
      icon: data.icon || 'bot',
      lastEdited: new Date(),
      status: data.status || 'draft'
    };
    
    setAgents(prev => [...prev, newAgent]);
    return newAgent;
  };

  return { agents, createAgent };
}