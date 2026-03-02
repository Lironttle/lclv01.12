'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useIsMobile } from '@/lib/use-is-mobile';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, HEADER_HEIGHT } from '@/lib/constants';
import MatrixRain from '@/components/ui/matrix-code';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MATRIX_DURATION = 1800;

export function MainLayout({ children }: MainLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showMatrix, setShowMatrix] = useState(true);
    const [matrixFading, setMatrixFading] = useState(false);
    const isMobile = useIsMobile();
    const pathname = usePathname();

    const triggerMatrix = useCallback(() => {
        setShowMatrix(true);
        setMatrixFading(false);
        const fadeTimer = setTimeout(() => setMatrixFading(true), MATRIX_DURATION - 500);
        const hideTimer = setTimeout(() => {
            setShowMatrix(false);
            setMatrixFading(false);
        }, MATRIX_DURATION);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    // Trigger on initial mount
    useEffect(() => {
        return triggerMatrix();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Trigger on page/route change
    useEffect(() => {
        return triggerMatrix();
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
    const mainMargin = isMobile ? 0 : sidebarWidth;

    return (
        <div className="relative min-h-screen text-white">
            {showMatrix && (
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        zIndex: 50,
                        opacity: matrixFading ? 0 : 1,
                        transition: 'opacity 500ms ease-out',
                    }}
                >
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
                }}
            >
                <div className="max-w-[1400px] mx-auto px-4 py-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
