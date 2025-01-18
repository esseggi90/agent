import React from 'react';
import { Home, Users, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <span className="text-xl font-bold text-gray-900">AI Agents</span>
      </div>
      
      {children}
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-lg bg-gray-100">
          <Home className="h-5 w-5 mr-3 text-gray-500" />
          Dashboard
        </a>
        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
          <Users className="h-5 w-5 mr-3 text-gray-400" />
          Team
        </a>
        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
          <Settings className="h-5 w-5 mr-3 text-gray-400" />
          Settings
        </a>
        <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
          <HelpCircle className="h-5 w-5 mr-3 text-gray-400" />
          Help
        </a>
      </nav>
    </div>
  );
}