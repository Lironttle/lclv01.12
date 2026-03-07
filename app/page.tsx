'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Zap, ArrowRight } from 'lucide-react';

const sections = [
    {
        title: 'Fitness & Health',
        description: 'Track your nutrition, exercise routines, and body metrics all in one place.',
        href: '/fitness/dashboard',
        icon: Activity,
        color: '#22C55E',
        bgColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
    },
    {
        title: 'LCL Automation',
        description: 'Manage leads, tasks, pipeline, outreach, contacts, clients, and analytics.',
        href: '/lcl-automation',
        icon: Zap,
        color: '#b91c1c',
        bgColor: 'rgba(115, 4, 4, 0.15)',
        borderColor: 'rgba(115, 4, 4, 0.4)',
    },
];

export default function HomePage() {
    return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
            <div className="text-center space-y-3 max-w-lg">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Welcome to LCL Portal
                </h1>
                <p className="text-[#a3a3a3] text-base md:text-lg">
                    Choose a section to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link
                            key={section.href}
                            href={section.href}
                            className="group relative rounded-xl border p-6 transition-all duration-300 hover:scale-[1.02]"
                            style={{
                                backgroundColor: section.bgColor,
                                borderColor: section.borderColor,
                            }}
                        >
                            <div className="flex flex-col gap-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: section.bgColor }}
                                >
                                    <Icon className="w-6 h-6" style={{ color: section.color }} />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                        {section.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                    </h2>
                                    <p className="text-sm text-[#a3a3a3] leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
