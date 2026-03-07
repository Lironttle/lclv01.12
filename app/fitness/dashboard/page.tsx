'use client';

import React from 'react';
import { Activity, Apple, Dumbbell, HeartPulse, TrendingUp, TrendingDown } from 'lucide-react';

const stats = [
    { title: 'Calories Today', value: '1,850', target: '2,200', icon: Apple, color: '#22C55E' },
    { title: 'Workouts This Week', value: '4', target: '5', icon: Dumbbell, color: '#3B82F6' },
    { title: 'Current Weight', value: '78.5 kg', change: -0.3, icon: HeartPulse, color: '#F59E0B' },
    { title: 'Active Minutes', value: '45', target: '60', icon: Activity, color: '#8B5CF6' },
];

export default function FitnessDashboard() {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.title}
                            className="animate-fade-in rounded-xl border border-[#222] bg-[#111] p-5 space-y-3"
                            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#a3a3a3]">{stat.title}</span>
                                <Icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-[#666]">
                                {stat.target && <span>Target: {stat.target}</span>}
                                {stat.change !== undefined && (
                                    <span className="flex items-center gap-1">
                                        {stat.change < 0 ? (
                                            <TrendingDown className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <TrendingUp className="w-3 h-3 text-red-500" />
                                        )}
                                        {Math.abs(stat.change)} kg this week
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-xl border border-[#222] bg-[#111] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Weekly Overview</h2>
                <p className="text-[#a3a3a3] text-sm">
                    Your fitness dashboard provides an overview of your health metrics. Navigate to Nutrition, Exercise, or Body sections for detailed tracking.
                </p>
            </div>
        </div>
    );
}
