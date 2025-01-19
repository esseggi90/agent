export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'customer_support' | 'sales' | 'technical' | 'other';
  visibility: 'public' | 'private';
  icon?: string;
  coverImage?: string;
  lastEdited: Date;
  status: 'active' | 'draft' | 'archived';
  workspaceId: string;
  createdAt?: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  icon: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members?: string[];
  agentCount?: number;
}

export type WorkspaceIcon = {
  name: string;
  icon: typeof import('lucide-react').LucideIcon;
};