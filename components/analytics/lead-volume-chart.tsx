'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { getLeadsByDate } from '@/lib/mock-data';
import { COLORS } from '@/lib/constants';

export type AnalyticsDateRange = '7d' | '30d' | '90d' | 'ytd' | 'all';

interface LeadVolumeChartProps {
    range: AnalyticsDateRange;
}

const TOOLTIP_STYLE = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: 8,
    padding: '8px 12px',
};

function formatDateLabel(value: string) {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;

    const total = payload.find((p: any) => p.dataKey === 'leads')?.value ?? 0;
    const qualified = payload.find((p: any) => p.dataKey === 'qualified')?.value ?? 0;

    return (
        <div style={TOOLTIP_STYLE}>
            <p className="text-xs text-[#a3a3a3] mb-1">
                {formatDateLabel(label)} ·{' '}
                <span className="font-mono text-xs text-white">
                    {total.toString().padStart(2, '0')} leads
                </span>
            </p>
            <p className="text-xs text-[#a3a3a3]">
                Qualified:{' '}
                <span className="font-mono text-xs text-white">
                    {qualified.toString().padStart(2, '0')}
                </span>
            </p>
        </div>
    );
}

export function LeadVolumeChart({ range }: LeadVolumeChartProps) {
    const allData = getLeadsByDate();

    let data = allData;
    if (range === '7d') {
        data = allData.slice(-7);
    } else if (range === '30d') {
        data = allData.slice(-30);
    }
    // For '90d', 'ytd', 'all' we currently show the full 30‑day mock series

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-6 hover:border-[#333] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-semibold text-white">Lead Volume</h3>
                    <p className="text-xs text-[#666] mt-1">
                        Daily lead creation trend by total and qualified
                    </p>
                </div>
            </div>

            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatDateLabel}
                            tick={{ fill: '#666', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: COLORS.accent, strokeOpacity: 0.15, strokeWidth: 1 }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            iconSize={10}
                            wrapperStyle={{
                                paddingBottom: 12,
                                color: '#a3a3a3',
                                fontSize: 11,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="leads"
                            name="Total leads"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="qualified"
                            name="Qualified"
                            stroke="#22C55E"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

