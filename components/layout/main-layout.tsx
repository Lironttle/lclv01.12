'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useIsMobile } from '@/lib/use-is-mobile';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, HEADER_HEIGHT } from '@/lib/constants';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useIsMobile();

    const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
    const mainMargin = isMobile ? 0 : sidebarWidth;

    return (
        <div className="relative min-h-screen text-white">
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <Header
                onMenuClick={() => setMobileOpen(!mobileOpen)}
                sidebarWidth={sidebarWidth}
                isMobile={isMobile}
            />

            <main
                className="transition-all duration-300"
                style={{
                    marginLeft: mainMargin,
                    paddingTop: HEADER_HEIGHT,
                }}
            >
                <div className="max-w-[1400px] mx-auto px-4 py-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
