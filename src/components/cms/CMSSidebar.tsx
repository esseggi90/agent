import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { sidebarSections } from './config/sidebarConfig';
import CMSSidebarItem from './CMSSidebarItem';
import { Bot, X } from 'lucide-react';

interface CMSSidebarProps {
  className?: string;
}

export default function CMSSidebar({ className }: CMSSidebarProps) {
  const { workspaceId, agentId } = useParams();
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>(() => {
    const currentPath = location.pathname;
    const section = sidebarSections.find(section => 
      currentPath.includes(section.path) || 
      section.items?.some(item => currentPath.includes(item.path))
    );
    return section?.id || null;
  });

  const basePath = `/workspace/${workspaceId}/agents/${agentId}/cms`;

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className={`w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary-50 rounded-lg flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Agent CMS</h2>
            <p className="text-xs text-gray-500">Configuration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-0.5">
          {sidebarSections.map((section) => (
            <CMSSidebarItem
              key={section.id}
              section={section}
              isExpanded={expandedSection === section.id}
              basePath={basePath}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Need Help?</h4>
          <p className="text-xs text-gray-500 mb-3">Check our documentation for detailed guides and examples.</p>
          <a
            href="#"
            className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center"
          >
            View Documentation
          </a>
        </div>
      </div>
    </div>
  );
}