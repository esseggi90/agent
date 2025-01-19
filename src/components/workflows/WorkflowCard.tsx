import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Edit2, Trash2, Workflow } from 'lucide-react';
import type { WorkflowData } from '../../types';

interface WorkflowCardProps {
  workflow: WorkflowData;
  view?: 'grid' | 'list';
}

export default function WorkflowCard({ workflow, view = 'grid' }: WorkflowCardProps) {
  const navigate = useNavigate();
  const { workspaceId, agentId } = useParams();

  const statusColors = {
    active: 'bg-green-50 text-green-700 border-green-200/50',
    draft: 'bg-amber-50 text-amber-700 border-amber-200/50',
    archived: 'bg-gray-50 text-gray-700 border-gray-200/50'
  };

  const handleAction = (type: 'run' | 'edit' | 'delete') => {
    switch (type) {
      case 'edit':
        navigate(`/workspace/${workspaceId}/agents/${agentId}/cms/workflows/${workflow.id}`);
        break;
      case 'run':
        // Handle workflow execution
        console.log('Run workflow:', workflow.id);
        break;
      case 'delete':
        // Handle workflow deletion
        console.log('Delete workflow:', workflow.id);
        break;
    }
  };

  if (view === 'list') {
    return (
      <div className="group bg-white border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:border-primary-100">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <Workflow className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">{workflow.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[workflow.status]}`}>
              {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAction('edit')}
                className="btn-secondary"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleAction('run')}
                className="btn-primary"
              >
                <Play className="h-4 w-4 mr-2" />
                Run
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary-100">
      <div className="relative h-48 bg-primary-50">
        <div className="absolute inset-0 flex items-center justify-center">
          <Workflow className="h-16 w-16 text-primary-200" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm bg-white/90 ${statusColors[workflow.status]}`}>
            {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
            {workflow.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{workflow.description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={() => handleAction('delete')}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleAction('edit')}
              className="btn-secondary"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => handleAction('run')}
              className="btn-primary"
            >
              <Play className="h-4 w-4 mr-2" />
              Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}