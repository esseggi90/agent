import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { SidebarSection } from './types';

interface CMSSidebarItemProps {
  section: SidebarSection;
  isExpanded: boolean;
  basePath: string;
  onToggle: () => void;
}

export default function CMSSidebarItem({ 
  section, 
  isExpanded, 
  basePath,
  onToggle 
}: CMSSidebarItemProps) {
  const hasItems = section.items && section.items.length > 0;
  const Icon = section.icon;

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          isExpanded 
            ? 'text-primary-600 bg-primary-50' 
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-1.5 rounded-md transition-colors duration-200 ${
            isExpanded ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-gray-200'
          }`}>
            <Icon className={`h-4 w-4 ${isExpanded ? 'text-primary-600' : 'text-gray-500'}`} />
          </div>
          <span className="text-sm font-medium">{section.label}</span>
        </div>
        {hasItems && (
          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
            isExpanded ? 'rotate-90 text-primary-600' : 'text-gray-400'
          }`} />
        )}
      </button>

      {hasItems && isExpanded && (
        <div className="mt-1 ml-4 pl-4 border-l border-gray-100 space-y-1">
          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={`${basePath}${item.path}`}
              className={({ isActive }) => `
                block px-3 py-2 text-sm rounded-lg transition-all duration-200
                ${isActive 
                  ? 'text-primary-600 bg-primary-50 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}