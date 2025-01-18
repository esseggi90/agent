import React from 'react';
import { ChevronDown } from 'lucide-react';

interface WorkspaceSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function WorkspaceSelector({ selectedId, onSelect }: WorkspaceSelectorProps) {
  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100"
        onClick={() => onSelect('default')}
      >
        <span>Personal Workspace</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
}