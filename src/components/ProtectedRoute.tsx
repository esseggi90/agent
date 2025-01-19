import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useWorkspaces } from '../hooks/useWorkspaces';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { workspaces, loading: workspacesLoading } = useWorkspaces();
  const { workspaceId } = useParams();

  if (authLoading || workspacesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Validate workspace access
  if (workspaceId && !workspaces.some(w => w.id === workspaceId)) {
    // If the workspace doesn't exist or user doesn't have access,
    // redirect to the first available workspace
    if (workspaces.length > 0) {
      return <Navigate to={`/${workspaces[0].id}/dashboard`} replace />;
    }
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}