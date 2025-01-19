import React, { useState } from 'react';
import { Plus, Search, Filter, SortAsc, LayoutGrid, List, Workflow, Play, Edit2, Trash2, AlertCircle } from 'lucide-react';
import CreateWorkflowModal from '../../components/workflows/CreateWorkflowModal';
import WorkflowCard from '../../components/workflows/WorkflowCard';
import { useWorkflows } from '../../hooks/useWorkflows';
import { useParams } from 'react-router-dom';

export default function WorkflowsPage() {
  const { workspaceId, agentId } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { workflows, loading, error, createWorkflow } = useWorkflows(agentId || '');

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <div className="h-48 bg-gray-100" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-100 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 rounded w-full" />
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="pt-4 border-t border-gray-100 flex justify-end space-x-2">
                        <div className="h-9 w-20 bg-gray-100 rounded-xl" />
                        <div className="h-9 w-20 bg-gray-100 rounded-xl" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Workflows Grid/List */}
          {!loading && (
            <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4 sm:gap-6`}>
              {filteredWorkflows.length > 0 ? (
                filteredWorkflows.map((workflow) => (
                  <WorkflowCard 
                    key={workflow.id} 
                    workflow={workflow}
                    view={view}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                    <Workflow className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first workflow</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateWorkflowModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateWorkflow}
        />
      )}
    </div>
  );
}