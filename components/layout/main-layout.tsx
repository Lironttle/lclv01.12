'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useIsMobile } from '@/lib/use-is-mobile';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, HEADER_HEIGHT } from '@/lib/constants';
import MatrixRain from '@/components/ui/matrix-code';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MATRIX_PLAY_TIME = 1300;
const MATRIX_FADE_TIME = 500;

export function MainLayout({ children }: MainLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showMatrix, setShowMatrix] = useState(true);
    const [contentVisible, setContentVisible] = useState(false);
    const isFirstMount = useRef(true);
    const timersRef = useRef<NodeJS.Timeout[]>([]);
    const isMobile = useIsMobile();
    const pathname = usePathname();

    const clearTimers = useCallback(() => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    }, []);

    const triggerMatrix = useCallback(() => {
        clearTimers();
        setShowMatrix(true);
        setContentVisible(false);

        // After the matrix plays, start fading it out and fading content in
        const revealTimer = setTimeout(() => {
            setContentVisible(true);
        }, MATRIX_PLAY_TIME);

        // Remove the matrix canvas after the fade completes
        const cleanupTimer = setTimeout(() => {
            setShowMatrix(false);
        }, MATRIX_PLAY_TIME + MATRIX_FADE_TIME);

        timersRef.current = [revealTimer, cleanupTimer];
    }, [clearTimers]);

    // Trigger on initial mount
    useEffect(() => {
        triggerMatrix();
        return clearTimers;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Trigger on route change (skip the first mount since the above handles it)
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }
        triggerMatrix();
    }, [pathname, triggerMatrix]);

    const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
    const mainMargin = isMobile ? 0 : sidebarWidth;

    return (
        <div className="relative min-h-screen text-white">
            {/* Matrix overlay — covers everything including sidebar/header */}
            {showMatrix && (
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        zIndex: 9999,
                        opacity: contentVisible ? 0 : 1,
                        transition: `opacity ${MATRIX_FADE_TIME}ms ease-out`,
                    }}
                >
                    {/* Solid black background so page content never peeks through */}
                    <div className="absolute inset-0 bg-black" />
                    <MatrixRain
                        fontSize={20}
                        color="#730404"
                        characters="01"
                        fadeOpacity={0.1}
                        speed={1.0}
                    />
                </div>
            )}

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
                    opacity: contentVisible ? 1 : 0,
                    transition: `opacity ${MATRIX_FADE_TIME}ms ease-in`,
                }}
            >
                <div className="max-w-[1400px] mx-auto px-4 py-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
