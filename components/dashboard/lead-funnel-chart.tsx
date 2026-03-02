'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { getFunnelMetrics } from '@/lib/mock-data';
import { TrendingDown } from 'lucide-react';

const data = getFunnelMetrics();

// Custom tooltip
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;

    const item = payload[0];
    return (
        <div className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 shadow-xl">
            <p className="text-xs text-[#a3a3a3] mb-1">{label}</p>
            <p className="text-lg font-bold font-mono text-white">{item.value}</p>
            <p className="text-xs text-[#666] mt-1">leads in stage</p>
        </div>
    );
}

export function LeadFunnelChart() {
    // Calculate total drop-off
    const firstStage = data[0]?.count || 0;
    const lastStage = data[data.length - 1]?.count || 0;
    const conversionRate = firstStage > 0 ? ((lastStage / firstStage) * 100).toFixed(1) : '0';

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-4 md:p-6 hover:border-[#333] transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-semibold text-white">Lead Funnel</h3>
                    <p className="text-xs text-[#666] mt-1">Conversion through pipeline stages</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22C55E]/10">
                    <TrendingDown className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span className="text-xs font-medium text-[#22C55E] font-mono">{conversionRate}% conv.</span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis
                            dataKey="stage"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(115, 4, 4, 0.08)' }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    fillOpacity={0.85}
                                    className="transition-all duration-300 hover:opacity-100"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Stage summary pills */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1a1a1a]">
                {data.map((stage) => (
                    <div
                        key={stage.stage}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a0a0a] border border-[#222]"
                    >
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: stage.color }}
                        />
                        <span className="text-xs text-[#a3a3a3]">{stage.stage}</span>
                        <span className="text-xs font-mono font-medium text-white">{stage.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
