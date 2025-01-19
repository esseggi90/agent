import React from 'react';
import { Outlet } from 'react-router-dom';
import CMSSidebar from './CMSSidebar';

export default function CMSLayout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CMSSidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}