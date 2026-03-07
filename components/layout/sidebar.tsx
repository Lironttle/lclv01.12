'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_SECTIONS, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/lib/constants';
import {
    LayoutDashboard, Users, CheckSquare, GitBranch,
    MessageSquare, Contact, Building2, BarChart3,
    Settings, ChevronLeft, ChevronRight, ChevronDown,
    Home, Activity, Apple, Dumbbell, HeartPulse, Zap,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
    LayoutDashboard, Users, CheckSquare, GitBranch,
    MessageSquare, Contact, Building2, BarChart3,
    Settings, Home, Activity, Apple, Dumbbell, HeartPulse, Zap,
};

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
        // Auto-open the section that contains the current route
        const initial: Record<string, boolean> = {};
        for (const section of NAV_SECTIONS) {
            if (section.children) {
                const isActive = section.children.some((item) => pathname === item.href || pathname.startsWith(item.href + '/'));
                if (isActive) initial[section.label] = true;
            }
        }
        return initial;
    });

    const toggleSection = (label: string) => {
        setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
    };

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
                    {NAV_SECTIONS.map((section) => {
                        const SectionIcon = iconMap[section.icon] || LayoutDashboard;

                        // Top-level link (no children) - e.g. Home, Settings
                        if (!section.children) {
                            const isActive = pathname === section.href;
                            return (
                                <Link
                                    key={section.label}
                                    href={section.href!}
                                    onClick={onMobileClose}
                                    className={cn(
                                        'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-[#730404]/20 text-white border border-[#730404]/40'
                                            : 'text-[#a3a3a3] hover:text-white hover:bg-white/5 border border-transparent',
                                    )}
                                >
                                    <SectionIcon
                                        className={cn(
                                            'w-5 h-5 shrink-0 transition-colors',
                                            isActive ? 'text-[#b91c1c]' : 'text-[#666] group-hover:text-[#a3a3a3]',
                                        )}
                                    />
                                    <span className={cn('truncate', collapsed ? 'md:hidden' : '')}>
                                        {section.label}
                                    </span>
                                </Link>
                            );
                        }

                        // Collapsible section with children
                        const isOpen = openSections[section.label] ?? false;
                        const sectionActive = section.children.some(
                            (item) => pathname === item.href || pathname.startsWith(item.href + '/')
                        );

                        return (
                            <div key={section.label}>
                                <button
                                    onClick={() => toggleSection(section.label)}
                                    className={cn(
                                        'w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                        sectionActive
                                            ? 'text-white'
                                            : 'text-[#a3a3a3] hover:text-white hover:bg-white/5',
                                    )}
                                >
                                    <SectionIcon
                                        className={cn(
                                            'w-5 h-5 shrink-0 transition-colors',
                                            sectionActive ? 'text-[#b91c1c]' : 'text-[#666] group-hover:text-[#a3a3a3]',
                                        )}
                                    />
                                    <span className={cn('truncate flex-1 text-left', collapsed ? 'md:hidden' : '')}>
                                        {section.label}
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            'w-4 h-4 shrink-0 transition-transform duration-200 text-[#666]',
                                            isOpen ? 'rotate-180' : '',
                                            collapsed ? 'md:hidden' : '',
                                        )}
                                    />
                                </button>

                                {/* Children */}
                                <div
                                    className={cn(
                                        'overflow-hidden transition-all duration-200',
                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                                        collapsed ? 'md:max-h-0 md:opacity-0' : '',
                                    )}
                                >
                                    <div className="ml-4 pl-3 border-l border-[#222] space-y-0.5 py-1">
                                        {section.children.map((item) => {
                                            const Icon = iconMap[item.icon] || LayoutDashboard;
                                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={onMobileClose}
                                                    className={cn(
                                                        'group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                                                        isActive
                                                            ? 'bg-[#730404]/20 text-white border border-[#730404]/40'
                                                            : 'text-[#a3a3a3] hover:text-white hover:bg-white/5 border border-transparent',
                                                    )}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            'w-4 h-4 shrink-0 transition-colors',
                                                            isActive ? 'text-[#b91c1c]' : 'text-[#666] group-hover:text-[#a3a3a3]',
                                                        )}
                                                    />
                                                    <span className="truncate">{item.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
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
