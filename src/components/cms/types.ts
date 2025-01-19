import { DivideIcon as LucideIcon } from 'lucide-react';

export interface SidebarItem {
  name: string;
  path: string;
}

export interface SidebarSection {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  items?: SidebarItem[];
}