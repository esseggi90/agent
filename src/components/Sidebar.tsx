import React from 'react';
import { Home, Users, Settings, HelpCircle, Bot, BarChart2, Book, Zap } from 'lucide-react';
import { User } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import WorkspaceSelector from './workspace/WorkspaceSelector';

interface SidebarProps {
  user: User | null;
  onCreateWorkspace: () => void;
  selectedWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
}

export default function Sidebar({ user, onCreateWorkspace, selectedWorkspaceId, onSelectWorkspace }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white flex flex-col h-full">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 text-transparent bg-clip-text">
            AI Agents
          </span>
        </div>
      </div>
      
      <WorkspaceSelector
        selectedId={selectedWorkspaceId}
        onSelect={onSelectWorkspace}
        onCreateWorkspace={onCreateWorkspace}
      />
      
      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </h3>
          <div className="mt-2 space-y-1">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                isActive('/dashboard') 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/agents')}
              className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                isActive('/agents') 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bot className="h-5 w-5 mr-3" />
              Agents
            </button>
            <button 
              onClick={() => {}}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <BarChart2 className="h-5 w-5 mr-3 text-gray-400" />
              Analytics
            </button>
            <button 
              onClick={() => {}}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <Zap className="h-5 w-5 mr-3 text-gray-400" />
              Workflows
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Team
          </h3>
          <div className="mt-2 space-y-1">
            <button 
              onClick={() => {}}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <Users className="h-5 w-5 mr-3 text-gray-400" />
              Members
            </button>
            <button 
              onClick={() => {}}
              className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center">
                <Book className="h-5 w-5 mr-3 text-gray-400" />
                Documentation
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                New
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}