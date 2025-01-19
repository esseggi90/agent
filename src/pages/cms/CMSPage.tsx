import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bot, Blocks, Code2, Rocket, ScrollText, BarChart2, Settings, ChevronRight, Users, MessageSquare, Clock, Bell } from 'lucide-react';

export default function CMSPage() {
  const { agentId } = useParams();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const sections = [
    {
      title: 'Content Management',
      description: 'Manage your agent\'s responses and knowledge base',
      icon: Blocks,
      path: 'content',
      stats: { total: '124 entries', updated: '2 hours ago' }
    },
    {
      title: 'Workflow Builder',
      description: 'Design and configure conversation flows',
      icon: Code2,
      path: 'workflows',
      stats: { total: '8 workflows', updated: '1 day ago' }
    },
    {
      title: 'Integration',
      description: 'Connect with external services and APIs',
      icon: Code2,
      path: 'integration',
      stats: { total: '3 active', updated: '5 days ago' }
    },
    {
      title: 'Publishing',
      description: 'Deploy and manage your agent across platforms',
      icon: Rocket,
      path: 'publish',
      stats: { total: '2 channels', updated: '1 week ago' }
    },
    {
      title: 'Transcripts',
      description: 'Review past conversations and interactions',
      icon: ScrollText,
      path: 'transcripts',
      stats: { total: '1.2k records', updated: 'Live' }
    },
    {
      title: 'Analytics',
      description: 'Monitor performance and gather insights',
      icon: BarChart2,
      path: 'analytics',
      stats: { total: '89% satisfaction', updated: 'Real-time' }
    }
  ];

  const stats = [
    { label: 'Total Conversations', value: '2,345', icon: MessageSquare, trend: '+12.3%', color: 'green' },
    { label: 'Active Users', value: '892', icon: Users, trend: '+5.2%', color: 'green' },
    { label: 'Avg. Response Time', value: '1.2s', icon: Clock, trend: '-0.3s', color: 'green' },
    { label: 'Pending Tasks', value: '5', icon: Bell, trend: '+2', color: 'amber' }
  ];

  const activities = [
    {
      id: 1,
      type: 'update',
      title: 'Workflow Updated',
      description: 'Customer onboarding flow modified',
      icon: Code2,
      timestamp: '2 hours ago',
      color: 'blue'
    },
    {
      id: 2,
      type: 'integration',
      title: 'New Integration Added',
      description: 'Connected to Slack workspace',
      icon: Rocket,
      timestamp: '4 hours ago',
      color: 'purple'
    },
    {
      id: 3,
      type: 'content',
      title: 'Content Updated',
      description: 'Added 15 new response templates',
      icon: Blocks,
      timestamp: '1 day ago',
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agent Configuration</h1>
              <p className="mt-2 text-sm text-gray-500">
                Configure and manage your agent's settings, content, and workflows
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="btn-secondary">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button className="btn-primary">
                <Rocket className="h-4 w-4 mr-2" />
                Deploy Changes
              </button>
            </div>
          </div>

          {/* Agent Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-gray-900">Customer Support Agent</h2>
                    <span className="px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-200/50">
                      Draft
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">ID: {agentId}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 bg-gray-50/50 rounded-b-xl">
              {stats.map((stat, i) => (
                <div key={i} className="p-4 sm:p-6">
                  <div className="flex items-center space-x-2">
                    <stat.icon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                  </div>
                  <div className="mt-2 flex items-baseline space-x-2">
                    <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
                    <span className={`text-sm font-medium text-${stat.color}-600`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sections.map((section) => (
              <div
                key={section.path}
                className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-200">
                    <section.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      {section.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {section.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{section.stats.total}</span>
                        <span className="text-xs text-gray-500">Last updated {section.stats.updated}</span>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start space-x-4">
                    <div className={`h-8 w-8 bg-${activity.color}-50 rounded-lg flex items-center justify-center`}>
                      <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 truncate">{activity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}