'use client';

import React from 'react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { LeadFunnelChart } from '@/components/dashboard/lead-funnel-chart';
import { PipelineStatus } from '@/components/dashboard/pipeline-status';
import { TodayTasks } from '@/components/dashboard/today-tasks';
import { RecentOutreach } from '@/components/dashboard/recent-outreach';
import { mockLeads, mockClients, mockTasks } from '@/lib/mock-data';

// Compute live stats from mock data
const totalLeads = mockLeads.length;
const activeClients = mockClients.filter((c) => c.status === 'active' || c.status === 'onboarding').length;
const activeTasks = mockTasks.filter((t) => t.status !== 'done').length;
const monthlyRevenue = mockClients.reduce((sum, c) => sum + c.mrr, 0);

function formatCurrency(val: number): string {
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(1)}K`;
  }
  return `$${val}`;
}

const stats = [
  {
    title: 'Total Leads',
    value: totalLeads.toString(),
    change: 12.5,
    trend: 'up' as const,
    icon: 'Users',
  },
  {
    title: 'Active Tasks',
    value: activeTasks.toString(),
    change: -3.2,
    trend: 'down' as const,
    icon: 'CheckSquare',
  },
  {
    title: 'Active Clients',
    value: activeClients.toString(),
    change: 20.0,
    trend: 'up' as const,
    icon: 'Building2',
  },
  {
    title: 'Monthly Revenue',
    value: formatCurrency(monthlyRevenue),
    change: 5.3,
    trend: 'up' as const,
    icon: 'DollarSign',
  },
];

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* Row 1: Funnel Chart (60%) | Pipeline Status (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
          <LeadFunnelChart />
        </div>
        <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
          <PipelineStatus />
        </div>
      </div>

      {/* Row 2: Today Tasks (50%) | Recent Outreach (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
          <TodayTasks />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
          <RecentOutreach />
        </div>
      </div>
    </div>
  );
}
