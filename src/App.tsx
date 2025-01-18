import React, { useState } from 'react';
import { AuthProvider } from './providers/AuthProvider';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import WorkspaceSelector from './components/workspace/WorkspaceSelector';
import CreateAgentModal from './components/agent/CreateAgentModal';
import { useAgents } from './hooks/useAgents';
import { Plus, Search, Filter, SortAsc } from 'lucide-react';

function AppContent() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const { agents, createAgent } = useAgents(selectedWorkspaceId);

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateAgent = async (data: any) => {
    try {
      await createAgent({
        ...data,
        icon: 'bot',
        status: 'draft'
      });
      setShowCreateAgent(false);
    } catch (error) {
      console.error('Failed to create agent:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <WorkspaceSelector
          selectedId={selectedWorkspaceId}
          onSelect={setSelectedWorkspaceId}
        />
      </Sidebar>
      
      <div className="flex-1 flex flex-col">
        <Header onNewAgent={() => setShowCreateAgent(true)} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Dashboard Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Agents Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor your AI agents
              </p>
            </div>

            {/* Action Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <SortAsc className="h-4 w-4 mr-2" />
                  Sort
                </button>
                <button
                  onClick={() => setShowCreateAgent(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Agent
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Agents', value: agents.length },
                { label: 'Active Agents', value: agents.filter(a => a.status === 'active').length },
                { label: 'Draft Agents', value: agents.filter(a => a.status === 'draft').length }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Agents Grid */}
            <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} view={view} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No agents found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showCreateAgent && (
        <CreateAgentModal
          onClose={() => setShowCreateAgent(false)}
          onSubmit={handleCreateAgent}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}