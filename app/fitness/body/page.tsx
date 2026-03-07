'use client';

import React from 'react';
import { Scale, Ruler, HeartPulse, TrendingDown } from 'lucide-react';
import InteractiveMuscleMap from '@/components/fitness/interactive-muscle-map';

const bodyMetrics = [
    { label: 'Weight', value: '78.5', unit: 'kg', change: -0.3, icon: Scale, color: '#F59E0B' },
    { label: 'Body Fat', value: '16.2', unit: '%', change: -0.4, icon: TrendingDown, color: '#EF4444' },
    { label: 'Muscle Mass', value: '35.8', unit: 'kg', change: +0.2, icon: Ruler, color: '#3B82F6' },
    { label: 'Resting HR', value: '62', unit: 'bpm', change: -1, icon: HeartPulse, color: '#22C55E' },
];

const measurements = [
    { part: 'Chest', value: '102 cm', change: '+0.5 cm' },
    { part: 'Waist', value: '82 cm', change: '-1.0 cm' },
    { part: 'Hips', value: '96 cm', change: '-0.3 cm' },
    { part: 'Biceps (L)', value: '36 cm', change: '+0.2 cm' },
    { part: 'Biceps (R)', value: '36.5 cm', change: '+0.3 cm' },
    { part: 'Thigh (L)', value: '58 cm', change: '+0.5 cm' },
    { part: 'Thigh (R)', value: '58.5 cm', change: '+0.4 cm' },
];

export default function BodyPage() {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Body stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bodyMetrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                        <div
                            key={m.label}
                            className="animate-fade-in rounded-xl border border-[#222] bg-[#111] p-5 space-y-3"
                            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#a3a3a3]">{m.label}</span>
                                <Icon className="w-5 h-5" style={{ color: m.color }} />
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {m.value} <span className="text-sm font-normal text-[#666]">{m.unit}</span>
                            </div>
                            <span className={`text-xs ${m.change < 0 ? 'text-green-500' : 'text-[#a3a3a3]'}`}>
                                {m.change > 0 ? '+' : ''}{m.change} {m.unit} this week
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Interactive Muscle Map */}
            <InteractiveMuscleMap />

            {/* Measurements table */}
            <div className="rounded-xl border border-[#222] bg-[#111] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Body Measurements</h2>
                <div className="space-y-2">
                    {measurements.map((m) => (
                        <div key={m.part} className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
                            <span className="text-sm text-white">{m.part}</span>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-white">{m.value}</span>
                                <span className={`text-xs w-20 text-right ${
                                    m.change.startsWith('-') ? 'text-green-500' : 'text-[#a3a3a3]'
                                }`}>
                                    {m.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
