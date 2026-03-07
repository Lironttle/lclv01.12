'use client';

import React from 'react';
import { Apple, Droplets, Flame, Beef } from 'lucide-react';

const macros = [
    { label: 'Calories', value: '1,850', target: '2,200', unit: 'kcal', icon: Flame, color: '#F59E0B', pct: 84 },
    { label: 'Protein', value: '120', target: '150', unit: 'g', icon: Beef, color: '#EF4444', pct: 80 },
    { label: 'Carbs', value: '210', target: '275', unit: 'g', icon: Apple, color: '#22C55E', pct: 76 },
    { label: 'Water', value: '2.1', target: '3.0', unit: 'L', icon: Droplets, color: '#3B82F6', pct: 70 },
];

const meals = [
    { time: '08:00', name: 'Breakfast', items: 'Oatmeal, banana, protein shake', calories: 520 },
    { time: '12:30', name: 'Lunch', items: 'Grilled chicken, rice, vegetables', calories: 680 },
    { time: '16:00', name: 'Snack', items: 'Greek yogurt, almonds', calories: 250 },
    { time: '19:30', name: 'Dinner', items: 'Salmon, sweet potato, broccoli', calories: 400 },
];

export default function NutritionPage() {
    return (
        <div className="animate-fade-in space-y-6">
            {/* Macro tracking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {macros.map((m, i) => {
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
                            <div className="space-y-1">
                                <div className="w-full h-2 rounded-full bg-[#222]">
                                    <div
                                        className="h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                                    />
                                </div>
                                <span className="text-xs text-[#666]">{m.pct}% of {m.target} {m.unit}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Meal log */}
            <div className="rounded-xl border border-[#222] bg-[#111] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s Meals</h2>
                <div className="space-y-3">
                    {meals.map((meal) => (
                        <div key={meal.time} className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-[#666] font-mono w-12">{meal.time}</span>
                                <div>
                                    <p className="text-sm font-medium text-white">{meal.name}</p>
                                    <p className="text-xs text-[#a3a3a3]">{meal.items}</p>
                                </div>
                            </div>
                            <span className="text-sm text-[#a3a3a3]">{meal.calories} kcal</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
