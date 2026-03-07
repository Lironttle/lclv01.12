'use client';

import React, { useMemo, useState } from 'react';
import { mockClients } from '@/lib/mock-data';
import { StatsCard } from '@/components/dashboard/stats-card';
import { LeadVolumeChart } from '@/components/analytics/lead-volume-chart';
import { FunnelChart } from '@/components/analytics/funnel-chart';
import { AnalyticsRevenueChart } from '@/components/analytics/revenue-chart';
import { DateRangePicker } from '@/components/analytics/date-range-picker';
import type { AnalyticsDateRange } from '@/components/analytics/lead-volume-chart';
import { getFunnelMetrics, getLeadsByDate, getRevenueByMonth } from '@/lib/mock-data';

export default function AnalyticsPage() {
    const [range, setRange] = useState<AnalyticsDateRange>('30d');

    const { totalLeads, leadChange, conversionRate, conversionChange, mrr, mrrChange } =
        useMemo(() => {
            const leadsSeries = getLeadsByDate();
            const recentLeads = leadsSeries.slice(-7);
            const prevLeads = leadsSeries.slice(-14, -7);
            const totalRecentLeads = recentLeads.reduce((sum, d) => sum + d.leads, 0);
            const totalPrevLeads = prevLeads.reduce((sum, d) => sum + d.leads, 0) || 1;
            const leadDelta = ((totalRecentLeads - totalPrevLeads) / totalPrevLeads) * 100;

            const funnel = getFunnelMetrics();
            const firstStage = funnel[0]?.count || 0;
            const lastStage = funnel[funnel.length - 1]?.count || 0;
            const convRate = firstStage > 0 ? (lastStage / firstStage) * 100 : 0;

            // Simple synthetic comparison for conversion change
            const conversionDelta = convRate - 25;

            const revenueSeries = getRevenueByMonth();
            const currentRevenue = revenueSeries[revenueSeries.length - 1]?.revenue ?? 0;
            const prevRevenue =
                (revenueSeries[revenueSeries.length - 2]?.revenue ?? currentRevenue) || 1;
            const revenueDelta =
                prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;

            const totalMrr = mockClients.reduce((sum, c) => sum + c.mrr, 0);

            return {
                totalLeads: totalRecentLeads,
                leadChange: leadDelta,
                conversionRate: convRate,
                conversionChange: conversionDelta,
                mrr: totalMrr,
                mrrChange: revenueDelta,
            };
        }, []);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-white">
                        Analytics Overview
                    </h1>
                    <p className="text-sm text-[#666] mt-1">
                        Track lead volume, funnel performance, and revenue trends in one place.
                    </p>
                </div>
                <DateRangePicker value={range} onChange={setRange} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatsCard
                    title="Leads (last 7 days)"
                    value={totalLeads}
                    change={Number(leadChange.toFixed(1))}
                    trend={leadChange >= 0 ? 'up' : 'down'}
                    icon="Users"
                    index={0}
                />
                <StatsCard
                    title="Funnel Conversion"
                    value={`${conversionRate.toFixed(1)}%`}
                    change={Number(conversionChange.toFixed(1))}
                    trend={conversionChange >= 0 ? 'up' : 'down'}
                    icon="CheckSquare"
                    index={1}
                />
                <StatsCard
                    title="Total MRR"
                    value={`$${mrr.toLocaleString('en-US')}`}
                    change={Number(mrrChange.toFixed(1))}
                    trend={mrrChange >= 0 ? 'up' : 'down'}
                    icon="DollarSign"
                    index={2}
                />
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <LeadVolumeChart range={range} />
                </div>
                <div className="lg:col-span-1">
                    <FunnelChart range={range} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnalyticsRevenueChart range={range} />
                <div className="rounded-xl bg-[#111] border border-[#222] p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-white">
                            Key Insights (Sample Data)
                        </h3>
                        <p className="text-xs text-[#666] mt-1">
                            This section highlights a few quick takeaways from the current mock
                            analytics.
                        </p>
                    </div>
                    <ul className="mt-4 space-y-2 text-xs text-[#a3a3a3]">
                        <li>• Qualified leads make up a strong share of recent volume.</li>
                        <li>• Funnel conversion is trending toward the 25% target benchmark.</li>
                        <li>• MRR has grown compared to the previous month in mock data.</li>
                    </ul>
                    <p className="mt-4 text-[11px] text-[#555]">
                        Once connected to real data (e.g. Supabase), this area can be powered by
                        dynamic insights or anomaly detection.
                    </p>
                </div>
            </div>
        </div>
    );
}
