import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './components/Dashboard';
import AgentsPage from './components/agents/AgentsPage';
import CMSLayout from './components/cms/CMSLayout';
import CMSPage from './pages/cms/CMSPage';
import WorkflowsPage from './pages/cms/WorkflowsPage';
import { useWorkspaces } from './hooks/useWorkspaces';

function WorkspaceRedirect() {
  const { workspaces, loading } = useWorkspaces();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return <Navigate to="/auth" replace />;
  }

  return <Navigate to={`/${workspaces[0].id}/dashboard`} replace />;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/:workspaceId/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/:workspaceId/agents"
        element={
          <ProtectedRoute>
            <AgentsPage />
          </ProtectedRoute>
        }
      />

      {/* CMS Routes */}
      <Route
        path="/workspace/:workspaceId/agents/:agentId/cms/*"
        element={
          <ProtectedRoute>
            <CMSLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CMSPage />} />
        <Route path="content" element={<CMSPage />} />
        <Route path="workflows" element={<WorkflowsPage />} />
        <Route path="integration" element={<CMSPage />} />
        <Route path="publish" element={<CMSPage />} />
        <Route path="transcripts" element={<CMSPage />} />
        <Route path="analytics" element={<CMSPage />} />
        <Route path="settings" element={<CMSPage />} />
      </Route>

      <Route path="/" element={<WorkspaceRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}