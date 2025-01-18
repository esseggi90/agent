import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Edit2, Archive, Clock, Bot } from 'lucide-react';
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
    active: 'bg-green-50 text-green-700 border-green-200/50',
    draft: 'bg-amber-50 text-amber-700 border-amber-200/50',
    archived: 'bg-gray-50 text-gray-700 border-gray-200/50'
  };

  if (view === 'list') {
    return (
      <div className="group bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-primary-100">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center overflow-hidden">
              {agent.coverImage ? (
                <img
                  src={agent.coverImage}
                  alt={agent.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Bot className="h-6 w-6 text-primary-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{agent.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[agent.status]}`}>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </span>
            <button
              onClick={handleAction}
              className="btn-primary"
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
    <div className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary-100">
      <div className="relative h-48 bg-primary-50">
        {agent.coverImage ? (
          <img
            src={agent.coverImage}
            alt={agent.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Bot className="h-16 w-16 text-primary-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm bg-white/90 ${statusColors[agent.status]}`}>
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
            {agent.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{agent.description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(agent.lastEdited).toLocaleDateString()}
          </div>
          <button
            onClick={handleAction}
            className="btn-primary shadow-sm group-hover:shadow-md transition-all duration-300"
          >
            {agent.status === 'draft' ? <Edit2 className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {agent.status === 'draft' ? 'Edit' : 'Run'}
          </button>
        </div>
      </div>
    </div>
  );
}