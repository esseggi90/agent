import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './layout/Header';
import { BarChart2, ArrowUp, ArrowDown, Users, MessageSquare, Bot, Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const stats = [
    {
      name: 'Total Conversations',
      value: '2,345',
      change: '+12.3%',
      trend: 'up',
      icon: MessageSquare
    },
    {
      name: 'Active Agents',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: Bot
    },
    {
      name: 'User Satisfaction',
      value: '94.2%',
      change: '-0.8%',
      trend: 'down',
      icon: Users
    },
    {
      name: 'Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'up',
      icon: Activity
    }
  ];

  const agentPerformance = [
    { name: 'Customer Support Bot', conversations: 856, satisfaction: 95, responseTime: 0.8 },
    { name: 'Sales Assistant', conversations: 643, satisfaction: 92, responseTime: 1.1 },
    { name: 'Technical Support', conversations: 432, satisfaction: 89, responseTime: 1.5 },
    { name: 'Onboarding Guide', conversations: 324, satisfaction: 97, responseTime: 0.9 }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl
        lg:relative lg:translate-x-0
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          user={user}
          selectedWorkspaceId={workspaceId || ''}
          onCreateWorkspace={() => {}}
          onSelectWorkspace={() => {}}
        />
      </div>
      
      <div className="flex-1 flex flex-col w-full">
        <Header onMenuClick={() => setShowMobileSidebar(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="mt-2 text-sm text-gray-500">
                Monitor your AI agents' performance and analytics
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center">
                      {React.createElement(stat.icon, { className: "h-6 w-6 text-primary-600" })}
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span>{stat.change}</span>
                      {stat.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Agent Performance</h2>
                <p className="text-sm text-gray-500 mt-1">Detailed metrics for each active agent</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Satisfaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Response Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {agentPerformance.map((agent) => (
                      <tr key={agent.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-lg bg-primary-50 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-primary-600" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {agent.conversations.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{agent.satisfaction}%</span>
                            <div className="ml-2 w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${agent.satisfaction}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {agent.responseTime}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}