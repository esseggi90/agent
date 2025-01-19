import React, { useState } from 'react';
import { ChevronDown, Briefcase, Plus, Code, Building2, Users, Rocket, Bot, Brain, Laptop, Zap } from 'lucide-react';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import type { WorkspaceIcon } from '../../types';

const workspaceIcons: Record<string, typeof import('lucide-react').LucideIcon> = {
  briefcase: Briefcase,
  code: Code,
  building: Building2,
  users: Users,
  rocket: Rocket,
  bot: Bot,
  brain: Brain,
  laptop: Laptop,
  zap: Zap,
};

interface WorkspaceSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onCreateWorkspace: () => void;
}

export default function WorkspaceSelector({ selectedId, onSelect, onCreateWorkspace }: WorkspaceSelectorProps) {
  const { workspaces, loading } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);

  const selectedWorkspace = workspaces.find(w => w.id === selectedId) || workspaces[0];
  const IconComponent = selectedWorkspace?.icon ? workspaceIcons[selectedWorkspace.icon] || Briefcase : Briefcase;

  if (loading) {
    return (
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 border-b border-gray-100">
      <div className="relative">
        <button
          className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <IconComponent className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {selectedWorkspace?.name || 'Select Workspace'}
              </span>
              <span className="text-xs text-gray-500">
                {selectedWorkspace?.description ? (
                  <span className="line-clamp-1">{selectedWorkspace.description}</span>
                ) : (
                  `${selectedWorkspace?.agentCount || 0} agents`
                )}
              </span>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            {workspaces.map((workspace) => {
              const WorkspaceIcon = workspace.icon ? workspaceIcons[workspace.icon] || Briefcase : Briefcase;
              return (
                <button
                  key={workspace.id}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-3"
                  onClick={() => {
                    onSelect(workspace.id);
                    setIsOpen(false);
                  }}
                >
                  <WorkspaceIcon className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-col">
                    <span>{workspace.name}</span>
                    {workspace.description && (
                      <span className="text-xs text-gray-500 line-clamp-1">{workspace.description}</span>
                    )}
                  </div>
                </button>
              );
            })}
            <div className="border-t border-gray-100 mt-1">
              <button
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-3 text-primary-600"
                onClick={() => {
                  onCreateWorkspace();
                  setIsOpen(false);
                }}
              >
                <Plus className="h-4 w-4" />
                <span>Create New Workspace</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}