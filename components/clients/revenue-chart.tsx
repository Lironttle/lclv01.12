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
import type { Client } from '@/lib/types';
import { DollarSign } from 'lucide-react';

interface RevenueChartProps {
    clients: Client[];
    activeClientId?: string | null;
    onClientClick?: (clientId: string) => void;
}

function formatCurrencyShort(value: number): string {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
}

const TOOLTIP_STYLE = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: 8,
    padding: '8px 12px',
};

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    const client = item.payload;

    return (
        <div style={TOOLTIP_STYLE}>
            <p className="text-xs text-[#a3a3a3] mb-1">{client.companyName}</p>
            <p className="text-lg font-bold font-mono text-white">
                {formatCurrencyShort(client.mrr)} /mo
            </p>
            <p className="text-xs text-[#666] mt-1">
                Contract: {formatCurrencyShort(client.contractValue)}
            </p>
        </div>
    );
}

export function RevenueChart({ clients, activeClientId, onClientClick }: RevenueChartProps) {
    if (clients.length === 0) {
        return (
            <div className="rounded-xl bg-[#111] border border-[#222] p-6 flex items-center justify-center text-xs text-[#666]">
                No clients yet — add a client to see MRR distribution.
            </div>
        );
    }

    const data = clients.map((client) => ({
        id: client.id,
        companyName: client.companyName,
        mrr: client.mrr,
        contractValue: client.contractValue,
    }));

    const maxMrr = Math.max(...clients.map((c) => c.mrr));

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-5 hover:border-[#333] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-white">Client MRR</h3>
                    <p className="text-xs text-[#666] mt-1">
                        Monthly recurring revenue by active client
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22C55E]/10">
                    <DollarSign className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span className="text-xs font-medium text-[#22C55E] font-mono">
                        Top: {formatCurrencyShort(maxMrr)}/mo
                    </span>
                </div>
            </div>

            <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 5, left: -10, bottom: 20 }}
                        barCategoryGap="25%"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis
                            dataKey="companyName"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: '#666',
                                fontSize: 11,
                                fontFamily: 'var(--font-mono)',
                            }}
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: '#666',
                                fontSize: 11,
                                fontFamily: 'var(--font-mono)',
                            }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(115, 4, 4, 0.08)' }}
                        />
                        <Bar
                            dataKey="mrr"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                            onClick={(data) => {
                                if (!onClientClick) return;
                                const id = (data as any)?.id;
                                if (id) {
                                    onClientClick(id);
                                }
                            }}
                        >
                            {data.map((entry) => {
                                const isActive = entry.id === activeClientId;
                                return (
                                    <Cell
                                        key={entry.id}
                                        className="cursor-pointer transition-all duration-300"
                                        fill={isActive ? '#dc2626' : '#22C55E'}
                                        fillOpacity={isActive ? 0.95 : 0.8}
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

