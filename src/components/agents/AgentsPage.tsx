import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../layout/Header';
import AgentCard from '../AgentCard';
import CreateAgentModal from './CreateAgentModal';
import CreateWorkspaceModal from '../workspace/CreateWorkspaceModal';
import { useAgents } from '../../hooks/useAgents';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { Plus, Search, Filter, SortAsc, LayoutGrid, List } from 'lucide-react';

export default function AgentsPage() {
  const { user } = useAuth();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const { agents, loading: agentsLoading, createAgent } = useAgents(workspaceId || '');
  const { createWorkspace } = useWorkspaces();

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAgent = async (data: any) => {
    try {
      await createAgent(data);
      setShowCreateAgent(false);
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  const handleCreateWorkspace = async (data: { name: string; description: string; icon: string }) => {
    try {
      await createWorkspace(data);
      setShowCreateWorkspace(false);
    } catch (error) {
      console.error('Failed to create workspace:', error);
      throw error;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl
        lg:relative lg:translate-x-0
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          user={user} 
          onCreateWorkspace={() => setShowCreateWorkspace(true)}
          selectedWorkspaceId={workspaceId || ''}
          onSelectWorkspace={() => {}}
        />
      </div>
      
      <div className="flex-1 flex flex-col w-full">
        <Header onMenuClick={() => setShowMobileSidebar(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Agents</h1>
              <p className="mt-2 text-sm text-gray-500">
                Create and manage your AI agents
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-xl shadow-sm p-1 border border-gray-200">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg ${view === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
                
                <button className="btn-secondary">
                  <Filter className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                
                <button className="btn-secondary">
                  <SortAsc className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sort</span>
                </button>
                
                <button
                  onClick={() => setShowCreateAgent(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Agent</span>
                </button>
              </div>
            </div>

            {agentsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <div className="h-48 bg-gray-100" />
                      <div className="p-6 space-y-4">
                        <div className="h-6 bg-gray-100 rounded w-3/4" />
                        <div className="h-4 bg-gray-100 rounded w-full" />
                        <div className="h-4 bg-gray-100 rounded w-2/3" />
                        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-2">
                          <div className="h-9 w-20 bg-gray-100 rounded-xl" />
                          <div className="h-9 w-20 bg-gray-100 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6`}>
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} view={view} />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No agents found matching your search.</p>
                    <button
                      onClick={() => setShowCreateAgent(true)}
                      className="btn-primary mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Agent
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {showCreateAgent && (
        <CreateAgentModal
          onClose={() => setShowCreateAgent(false)}
          onSubmit={handleCreateAgent}
        />
      )}

      {showCreateWorkspace && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateWorkspace(false)}
          onSubmit={handleCreateWorkspace}
        />
      )}
    </div>
  );
}