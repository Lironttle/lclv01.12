'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/lib/constants';
import {
    LayoutDashboard, Users, CheckSquare, GitBranch,
    MessageSquare, Contact, Building2, BarChart3,
    Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard, Users, CheckSquare, GitBranch,
    MessageSquare, Contact, Building2, BarChart3, Settings,
};

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-full z-50 flex flex-col border-r transition-all duration-300 ease-in-out',
                    'bg-[#0a0a0a] border-[#1a1a1a]',
                    // Mobile: slide in/out, always expanded width
                    'md:translate-x-0',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
                style={{ width: `min(${collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH}px, 85vw)` }}
            >
                {/* Logo */}
                <div className="flex items-center h-16 px-4 border-b border-[#1a1a1a] shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden">
                            <Image
                                src="/lcl-logo.png"
                                alt="LCL Portal"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-cover"
                                priority
                            />
                        </div>
                        <span className={cn(
                            'text-base font-semibold text-white whitespace-nowrap tracking-tight',
                            collapsed ? 'md:hidden' : '',
                        )}>
                            LCL Portal
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => {
                        const Icon = iconMap[item.icon] || LayoutDashboard;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onMobileClose}
                                className={cn(
                                    'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-[#730404]/20 text-white border border-[#730404]/40'
                                        : 'text-[#a3a3a3] hover:text-white hover:bg-white/5 border border-transparent',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'w-5 h-5 shrink-0 transition-colors',
                                        isActive ? 'text-[#b91c1c]' : 'text-[#666] group-hover:text-[#a3a3a3]',
                                    )}
                                />
                                {/* Always show label on mobile, respect collapsed on desktop */}
                                <span className={cn('truncate', collapsed ? 'md:hidden' : '')}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle (desktop only) */}
                <div className="hidden md:flex items-center justify-center py-3 px-3 border-t border-[#1a1a1a] shrink-0">
                    <button
                        onClick={onToggle}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[#666] hover:text-white hover:bg-white/5 transition-colors text-sm"
                    >
                        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        {!collapsed && <span>Collapse</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
