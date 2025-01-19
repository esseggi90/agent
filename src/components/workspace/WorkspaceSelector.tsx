import React, { useState, useEffect, useCallback } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<typeof workspaces[0] | null>(null);

  // Initialize the component
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update selected workspace when workspaces or selectedId changes
  useEffect(() => {
    if (!mounted || loading || !workspaces.length) return;

    const workspace = workspaces.find(w => w.id === selectedId) || workspaces[0];
    setSelectedWorkspace(workspace);
  }, [mounted, loading, workspaces, selectedId]);

  // Handle click outside
  useEffect(() => {
    if (!mounted) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-workspace-selector]')) {
        setIsOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [mounted]);

  // Handle workspace selection
  const handleWorkspaceSelect = useCallback((workspace: typeof workspaces[0]) => {
    if (workspace.id === selectedWorkspace?.id) return;
    
    setIsOpen(false);
    requestAnimationFrame(() => {
      onSelect(workspace.id);
    });
  }, [selectedWorkspace, onSelect]);

  // Handle create workspace
  const handleCreateWorkspace = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      onCreateWorkspace();
    });
  }, [onCreateWorkspace]);

  if (loading || !selectedWorkspace) {
    return (
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const IconComponent = workspaceIcons[selectedWorkspace.icon] || Briefcase;

  return (
    <div className="px-4 py-4 border-b border-gray-100">
      <div className="relative" data-workspace-selector>
        <button
          type="button"
          className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          data-state={isOpen ? 'open' : 'closed'}
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
              <IconComponent className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {selectedWorkspace.name}
              </span>
              <span className="text-xs text-gray-500">
                {selectedWorkspace.description ? (
                  <span className="line-clamp-1">{selectedWorkspace.description}</span>
                ) : (
                  `${selectedWorkspace.agentCount || 0} agents`
                )}
              </span>
            </div>
          </div>
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <div 
            className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:top-full lg:left-0 lg:right-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-black/20 lg:hidden" onClick={() => setIsOpen(false)} />
            <div className="absolute top-0 left-0 right-0 lg:relative lg:top-2 bg-white rounded-b-xl lg:rounded-xl shadow-lg border-t lg:border border-gray-100 py-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {workspaces.map((workspace) => {
                const WorkspaceIcon = workspaceIcons[workspace.icon] || Briefcase;
                const isSelected = workspace.id === selectedWorkspace.id;

                return (
                  <button
                    key={workspace.id}
                    type="button"
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200 ${
                      isSelected ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => handleWorkspaceSelect(workspace)}
                  >
                    <WorkspaceIcon 
                      className={`h-4 w-4 ${
                        isSelected ? 'text-primary-600' : 'text-gray-400'
                      }`} 
                    />
                    <div className="flex flex-col">
                      <span className={isSelected ? 'text-primary-600' : ''}>
                        {workspace.name}
                      </span>
                      {workspace.description && (
                        <span className="text-xs text-gray-500 line-clamp-1">
                          {workspace.description}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
              
              <div className="border-t border-gray-100 mt-1">
                <button
                  type="button"
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center space-x-3 text-primary-600"
                  onClick={handleCreateWorkspace}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Workspace</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}