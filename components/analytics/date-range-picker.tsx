'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarRange } from 'lucide-react';
import type { AnalyticsDateRange } from './lead-volume-chart';

interface DateRangePickerProps {
    value: AnalyticsDateRange;
    onChange: (value: AnalyticsDateRange) => void;
}

const PRESETS: { value: AnalyticsDateRange; label: string }[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'ytd', label: 'Year to date' },
    { value: 'all', label: 'All time' },
];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] border border-[#222] px-2 py-1.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#111]">
                <CalendarRange className="w-3.5 h-3.5 text-[#a3a3a3]" />
                <span className="text-xs text-[#a3a3a3] font-medium tracking-wide uppercase">
                    Date Range
                </span>
            </div>
            <div className="flex items-center gap-1">
                {PRESETS.map((preset) => {
                    const isActive = preset.value === value;
                    return (
                        <button
                            key={preset.value}
                            type="button"
                            onClick={() => onChange(preset.value)}
                            className={cn(
                                'px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200',
                                'hover:bg-[#141414] hover:text-white',
                                isActive &&
                                    'bg-[#730404] text-white shadow-[0_0_0_1px_rgba(248,113,113,0.3)]',
                                !isActive && 'text-[#666]',
                            )}
                        >
                            {preset.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

