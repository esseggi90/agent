import React, { useEffect, useState } from 'react';
import { Home, Users, Settings, HelpCircle, Bot, BarChart2, Book, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';
import { User } from 'firebase/auth';
import WorkspaceSelector from './workspace/WorkspaceSelector';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SidebarProps {
  user: User | null;
  onCreateWorkspace: () => void;
  selectedWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email: string;
}

export default function Sidebar({ user, onCreateWorkspace, selectedWorkspaceId, onSelectWorkspace }: SidebarProps) {
  const { logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    }
    return userProfile?.email?.[0].toUpperCase() || '?';
  };

  const getDisplayName = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return userProfile?.email?.split('@')[0] || 'User';
  };

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
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-xl bg-primary-50 text-primary-700">
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <BarChart2 className="h-5 w-5 mr-3 text-gray-400" />
              Analytics
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <Zap className="h-5 w-5 mr-3 text-gray-400" />
              Workflows
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Team
          </h3>
          <div className="mt-2 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <Users className="h-5 w-5 mr-3 text-gray-400" />
              Members
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <Book className="h-5 w-5 mr-3 text-gray-400" />
                Documentation
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                New
              </span>
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Settings
          </h3>
          <div className="mt-2 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <Settings className="h-5 w-5 mr-3 text-gray-400" />
              General
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <HelpCircle className="h-5 w-5 mr-3 text-gray-400" />
              Help Center
            </a>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userProfile?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}