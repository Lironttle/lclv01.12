'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Users,
    CheckSquare,
    Building2,
    DollarSign,
    LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    Users,
    CheckSquare,
    Building2,
    DollarSign,
};

interface StatsCardProps {
    title: string;
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
    icon: string;
    index?: number; // for stagger animation
}

export function StatsCard({ title, value, change, trend, icon, index = 0 }: StatsCardProps) {
    const Icon = iconMap[icon] || Users;
    const isPositive = trend === 'up';
    const isNeutral = trend === 'neutral';

    const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

    return (
        <div
            className={cn(
                'card-glow group relative rounded-xl bg-[#111] border border-[#222] p-4 md:p-5',
                'flex flex-col gap-3 overflow-hidden',
                'hover:border-[#333] hover:bg-[#141414] transition-all duration-300',
            )}
            style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: 'backwards',
            }}
        >
            {/* Subtle gradient accent in the top-right */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#730404]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Header row */}
            <div className="flex items-center justify-between relative z-10">
                <span className="text-xs md:text-sm text-[#a3a3a3] font-medium tracking-wide uppercase">
                    {title}
                </span>
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#730404]/15 flex items-center justify-center group-hover:bg-[#730404]/25 transition-colors duration-300">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#b91c1c] group-hover:text-[#dc2626] transition-colors duration-300" />
                </div>
            </div>

            {/* Value */}
            <div className="relative z-10">
                <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-white">
                    {value}
                </span>
            </div>

            {/* Trend indicator */}
            <div className="flex items-center gap-2 relative z-10">
                <div
                    className={cn(
                        'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                        isPositive && 'bg-[#22C55E]/10 text-[#22C55E]',
                        !isPositive && !isNeutral && 'bg-[#EF4444]/10 text-[#EF4444]',
                        isNeutral && 'bg-[#666]/10 text-[#666]',
                    )}
                >
                    <TrendIcon className="w-3 h-3" />
                    <span>{isPositive ? '+' : ''}{change}%</span>
                </div>
                <span className="text-xs text-[#666]">vs last month</span>
            </div>
        </div>
    );
}
