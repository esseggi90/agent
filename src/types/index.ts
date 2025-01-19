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
  icon?: string;
  coverImage?: string;
  lastEdited: Date;
  status: 'active' | 'draft' | 'archived';
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members?: string[];
  agentCount?: number;
}