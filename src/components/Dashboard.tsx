import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import Sidebar from './Sidebar';
import Header from './Header';
import AgentCard from './AgentCard';
import WorkspaceSelector from './workspace/WorkspaceSelector';
import CreateAgentModal from './agent/CreateAgentModal';
import { useAgents } from '../hooks/useAgents';
import { Plus, Search, Filter, SortAsc, Menu, LayoutGrid, List } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = React.useState<string>('');
  const [showCreateAgent, setShowCreateAgent] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [showMobileSidebar, setShowMobileSidebar] = React.useState(false);
  
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar user={user} />
      </div>
      
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-50 transition-all duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Dashboard Header */}
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agents Dashboard</h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage and monitor your AI agents
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in" style={{ '--delay': '0.2s' } as React.CSSProperties}>
              {[
                { label: 'Total Agents', value: agents.length, icon: 'bot' },
                { label: 'Active Agents', value: agents.filter(a => a.status === 'active').length, icon: 'active' },
                { label: 'Draft Agents', value: agents.filter(a => a.status === 'draft').length, icon: 'draft' }
              ].map((stat, idx) => (
                <div key={idx} className="stat-card">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in" style={{ '--delay': '0.3s' } as React.CSSProperties}>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-xl shadow-sm p-1 border border-gray-200">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg ${view === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-500'} transition-all duration-200`}
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-500'} transition-all duration-200`}
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

            {/* Agents Grid */}
            <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6 animate-fade-in`} style={{ '--delay': '0.4s' } as React.CSSProperties}>
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