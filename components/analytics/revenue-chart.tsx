'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { getRevenueByMonth } from '@/lib/mock-data';
import { DollarSign } from 'lucide-react';

interface AnalyticsRevenueChartProps {
    range: '7d' | '30d' | '90d' | 'ytd' | 'all';
}

const TOOLTIP_STYLE = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: 8,
    padding: '8px 12px',
};

function formatCurrency(value: number): string {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    const item = payload[0];

    return (
        <div style={TOOLTIP_STYLE}>
            <p className="text-xs text-[#a3a3a3] mb-1">{label}</p>
            <p className="text-lg font-bold font-mono text-white">
                {formatCurrency(item.value)} MRR
            </p>
        </div>
    );
}

export function AnalyticsRevenueChart(_props: AnalyticsRevenueChartProps) {
    const data = getRevenueByMonth();
    const current = data[data.length - 1]?.revenue ?? 0;
    const prev = data[data.length - 2]?.revenue ?? current;
    const change = prev > 0 ? ((current - prev) / prev) * 100 : 0;
    const isUp = change >= 0;

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-6 hover:border-[#333] transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-semibold text-white">Revenue Over Time</h3>
                    <p className="text-xs text-[#666] mt-1">Monthly recurring revenue trend</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22C55E]/10">
                    <DollarSign className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span className="text-xs font-medium text-[#22C55E] font-mono">
                        {isUp ? '+' : ''}
                        {change.toFixed(1)}%
                    </span>
                </div>
            </div>

            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                            tick={{ fill: '#666', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#22C55E', strokeOpacity: 0.15, strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#22C55E"
                            strokeWidth={2}
                            fill="url(#revenueGradient)"
                            activeDot={{ r: 4 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

