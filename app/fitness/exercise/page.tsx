'use client';

import React from 'react';
import { Dumbbell, Timer, Flame, TrendingUp } from 'lucide-react';

const weeklyWorkouts = [
    { day: 'Mon', type: 'Upper Body', duration: '55 min', calories: 420, completed: true },
    { day: 'Tue', type: 'Cardio (HIIT)', duration: '30 min', calories: 350, completed: true },
    { day: 'Wed', type: 'Rest Day', duration: '—', calories: 0, completed: true },
    { day: 'Thu', type: 'Lower Body', duration: '50 min', calories: 380, completed: true },
    { day: 'Fri', type: 'Full Body', duration: '60 min', calories: 450, completed: false },
    { day: 'Sat', type: 'Cardio (Run)', duration: '45 min', calories: 400, completed: false },
    { day: 'Sun', type: 'Rest Day', duration: '—', calories: 0, completed: false },
];

const summaryStats = [
    { label: 'Workouts Done', value: '4 / 5', icon: Dumbbell, color: '#3B82F6' },
    { label: 'Total Duration', value: '2h 45m', icon: Timer, color: '#8B5CF6' },
    { label: 'Calories Burned', value: '1,150', icon: Flame, color: '#F59E0B' },
    { label: 'Streak', value: '12 days', icon: TrendingUp, color: '#22C55E' },
];

export default function ExercisePage() {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Summary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="animate-fade-in rounded-xl border border-[#222] bg-[#111] p-5 space-y-3"
                            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#a3a3a3]">{stat.label}</span>
                                <Icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Weekly plan */}
            <div className="rounded-xl border border-[#222] bg-[#111] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">This Week&apos;s Plan</h2>
                <div className="space-y-2">
                    {weeklyWorkouts.map((w) => (
                        <div
                            key={w.day}
                            className={`flex items-center justify-between py-3 px-4 rounded-lg border ${
                                w.completed
                                    ? 'border-green-900/30 bg-green-900/10'
                                    : 'border-[#1a1a1a] bg-[#0a0a0a]'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono font-medium text-[#a3a3a3] w-8">{w.day}</span>
                                <span className="text-sm text-white">{w.type}</span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-[#a3a3a3]">
                                <span className="w-16 text-right">{w.duration}</span>
                                <span className="w-20 text-right">{w.calories > 0 ? `${w.calories} kcal` : '—'}</span>
                                {w.completed ? (
                                    <span className="text-green-500 text-xs font-medium">Done</span>
                                ) : (
                                    <span className="text-[#666] text-xs">Upcoming</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
