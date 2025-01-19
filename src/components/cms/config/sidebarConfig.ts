import { 
  Blocks, 
  Code2, 
  Rocket,
  ScrollText,
  BarChart2,
  Settings,
  Workflow,
  Database,
  Zap,
  MessageSquare,
  FileText,
  PenTool as Tool
} from 'lucide-react';
import type { SidebarSection } from '../types';

export const sidebarSections: SidebarSection[] = [
  {
    id: 'content',
    icon: Database,
    label: 'Content',
    path: '/content',
    items: [
      { name: 'Knowledge Base', path: '/content/knowledge' },
      { name: 'Responses', path: '/content/responses' },
      { name: 'Media Library', path: '/content/media' }
    ]
  },
  {
    id: 'workflows',
    icon: Workflow,
    label: 'Workflows',
    path: '/workflows',
    items: [
      { name: 'All Workflows', path: '/workflows' },
      { name: 'Templates', path: '/workflows/templates' }
    ]
  },
  {
    id: 'integration',
    icon: Zap,
    label: 'Integration',
    path: '/integration',
    items: [
      { name: 'API Keys', path: '/integration/api-keys' },
      { name: 'Webhooks', path: '/integration/webhooks' },
      { name: 'Services', path: '/integration/services' }
    ]
  },
  {
    id: 'conversations',
    icon: MessageSquare,
    label: 'Conversations',
    path: '/conversations',
    items: [
      { name: 'Live Chat', path: '/conversations/live' },
      { name: 'History', path: '/conversations/history' },
      { name: 'Analytics', path: '/conversations/analytics' }
    ]
  },
  {
    id: 'training',
    icon: FileText,
    label: 'Training',
    path: '/training',
    items: [
      { name: 'Data Sets', path: '/training/datasets' },
      { name: 'Models', path: '/training/models' },
      { name: 'Evaluation', path: '/training/evaluation' }
    ]
  },
  {
    id: 'settings',
    icon: Tool,
    label: 'Settings',
    path: '/settings',
    items: [
      { name: 'General', path: '/settings/general' },
      { name: 'Appearance', path: '/settings/appearance' },
      { name: 'Security', path: '/settings/security' },
      { name: 'Team', path: '/settings/team' }
    ]
  }
];