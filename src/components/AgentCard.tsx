import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Edit2, Archive } from 'lucide-react';
import type { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  view?: 'grid' | 'list';
}

export default function AgentCard({ agent, view = 'grid' }: AgentCardProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (agent.status === 'draft') {
      navigate(`/workspace/${agent.workspaceId}/agents/${agent.id}/cms`);
    } else {
      navigate(`/workspace/${agent.workspaceId}/agents/${agent.id}/run`);
    }
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  };

  if (view === 'list') {
    return (
      <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <img
                src={agent.coverImage || '/default-agent.png'}
                alt={agent.name}
                className="h-8 w-8 object-cover rounded"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{agent.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[agent.status]}`}>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </span>
            <button
              onClick={handleAction}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {agent.status === 'draft' ? <Edit2 className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {agent.status === 'draft' ? 'Edit' : 'Run'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-blue-100">
      <div className="relative h-48">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform origin-left transition-transform duration-200 scale-x-0 group-hover:scale-x-100" />
        <img
          src={agent.coverImage || '/default-agent.png'}
          alt={agent.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[agent.status]}`}>
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{agent.description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last edited: {new Date(agent.lastEdited).toLocaleDateString()}
          </div>
          <button
            onClick={handleAction}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {agent.status === 'draft' ? <Edit2 className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {agent.status === 'draft' ? 'Edit' : 'Run'}
          </button>
        </div>
      </div>
    </div>
  );
}