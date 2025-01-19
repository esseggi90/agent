import React, { useState } from 'react';
import { Plus, Search, Filter, SortAsc, MoreVertical, AlertCircle, Workflow, MessageSquare, Zap, Bot, Copy, Trash2, Edit2 } from 'lucide-react';
import CreateWorkflowModal from '../../components/workflows/CreateWorkflowModal';
import { useWorkflows } from '../../hooks/useWorkflows';
import { useParams } from 'react-router-dom';

const workflowTypeIcons = {
  'conversation': MessageSquare,
  'automation': Bot,
  'integration': Zap,
  'default': Workflow
};

export default function WorkflowsPage() {
  const { workspaceId, agentId } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const { workflows, loading, error, createWorkflow, duplicateWorkflow, deleteWorkflow } = useWorkflows(agentId || '');

  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkflow = async (data: any) => {
    try {
      await createWorkflow({
        ...data,
        agentId,
        workspaceId
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create workflow:', error);
    }
  };

  const handleDuplicate = async (workflowId: string) => {
    try {
      await duplicateWorkflow(workflowId);
      setShowMenuId(null);
      setMenuPosition(null);
    } catch (error) {
      console.error('Failed to duplicate workflow:', error);
    }
  };

  const handleDelete = async (workflowId: string) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteWorkflow(workflowId);
        setShowMenuId(null);
        setMenuPosition(null);
      } catch (error) {
        console.error('Failed to delete workflow:', error);
      }
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (!(e.target as Element).closest('.workflow-menu')) {
      setShowMenuId(null);
      setMenuPosition(null);
    }
  };

  const handleMenuClick = (e: React.MouseEvent, workflowId: string) => {
    e.stopPropagation();
    const button = e.currentTarget as HTMLButtonElement;
    const rect = button.getBoundingClientRect();
    
    setShowMenuId(showMenuId === workflowId ? null : workflowId);
    setMenuPosition(showMenuId === workflowId ? null : {
      top: rect.bottom + window.scrollY + 8,
      left: rect.right - 192, // 192px is menu width (48px * 4)
    });
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Workflows</h1>
            <p className="mt-2 text-sm text-gray-500">
              Create and manage conversation flows for your AI agent
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <button className="btn-secondary">
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              
              <button className="btn-secondary">
                <SortAsc className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sort</span>
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">New Workflow</span>
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading workflows</h3>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse p-4">
                  <div className="h-5 bg-gray-100 rounded w-1/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Workflows List */}
          {!loading && (
            <div className="bg-white rounded-xl border border-gray-100 min-h-[300px]">
              {filteredWorkflows.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredWorkflows.map((workflow) => {
                    const IconComponent = workflowTypeIcons[workflow.type as keyof typeof workflowTypeIcons] || workflowTypeIcons.default;
                    
                    return (
                      <div key={workflow.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 truncate">{workflow.name}</h3>
                              <p className="mt-1 text-sm text-gray-500 truncate">{workflow.description}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                              workflow.status === 'active' 
                                ? 'bg-green-50 text-green-700 border border-green-200/50' 
                                : workflow.status === 'draft'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                                : 'bg-gray-50 text-gray-700 border border-gray-200/50'
                            }`}>
                              {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="workflow-menu">
                          <button
                            onClick={(e) => handleMenuClick(e, workflow.id)}
                            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500">No workflows found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menu Portal - Rendered at the root level */}
      {showMenuId && menuPosition && (
        <div 
          className="fixed z-[100] w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
        >
          <button
            onClick={() => {}}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => handleDuplicate(showMenuId)}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </button>
          <button
            onClick={() => handleDelete(showMenuId)}
            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      )}

      {showCreateModal && (
        <CreateWorkflowModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateWorkflow}
        />
      )}
    </div>
  );
}