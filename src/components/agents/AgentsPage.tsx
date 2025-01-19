import React, { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import Sidebar from '../Sidebar';
import AgentCard from '../AgentCard';
import WorkspaceSelector from '../workspace/WorkspaceSelector';
import CreateAgentModal from './CreateAgentModal';
import CreateWorkspaceModal from '../workspace/CreateWorkspaceModal';
import { useAgents } from '../../hooks/useAgents';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { Plus, Search, Filter, SortAsc, Menu, LayoutGrid, List, Bell, Settings, LogOut, User, HelpCircle } from 'lucide-react';

export default function AgentsPage() {
  const { user, logout } = useAuth();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const { agents, createAgent } = useAgents(selectedWorkspaceId);
  const { createWorkspace } = useWorkspaces();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          user={user} 
          onCreateWorkspace={() => setShowCreateWorkspace(true)}
          selectedWorkspaceId={selectedWorkspaceId}
          onSelectWorkspace={setSelectedWorkspaceId}
        />
      </div>
      
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-50"
              >
                <Menu className="h-6 w-6" />
              </button>

              <div className="flex-1"></div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Settings className="h-6 w-6" />
                </button>
                
                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium hover:opacity-90"
                  >
                    {user?.email?.charAt(0).toUpperCase()}
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.email}
                        </p>
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Help
                        </button>
                      </div>

                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Agents</h1>
              <p className="mt-2 text-sm text-gray-500">
                Create and manage your AI agents
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
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

            {/* Agents Grid */}
            <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6 animate-fade-in`}>
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

      {showCreateWorkspace && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateWorkspace(false)}
          onSubmit={handleCreateWorkspace}
        />
      )}
    </div>
  );
}