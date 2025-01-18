import React from 'react';
import { ChevronDown, Briefcase } from 'lucide-react';

interface WorkspaceSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function WorkspaceSelector({ selectedId, onSelect }: WorkspaceSelectorProps) {
  return (
    <div className="px-4 py-4 border-b border-gray-100">
      <button
        className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
        onClick={() => onSelect('default')}
      >
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary-600" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Personal Workspace</span>
            <span className="text-xs text-gray-500">5 active agents</span>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  );
}