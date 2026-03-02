'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Search } from 'lucide-react';
import { NAV_ITEMS, HEADER_HEIGHT } from '@/lib/constants';

interface HeaderProps {
    onMenuClick: () => void;
    sidebarWidth: number;
    isMobile: boolean;
}

export function Header({ onMenuClick, sidebarWidth, isMobile }: HeaderProps) {
    const pathname = usePathname();
    const currentPage = NAV_ITEMS.find((item) => item.href === pathname);
    const pageTitle = currentPage?.label || 'Dashboard';

    return (
        <header
            className="fixed top-0 right-0 z-30 flex items-center justify-between border-b bg-[#0a0a0a]/80 backdrop-blur-md border-[#1a1a1a] px-4 md:px-6 transition-all duration-300"
            style={{
                height: HEADER_HEIGHT,
                left: isMobile ? 0 : sidebarWidth,
            }}
        >
            {/* Left: Mobile menu + Page title */}
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-white/5 transition-colors shrink-0"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-base md:text-lg font-semibold text-white tracking-tight truncate">{pageTitle}</h1>
            </div>

            {/* Right: Search + Notifications */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
                <button className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-white/5 transition-colors">
                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button className="relative p-2 rounded-lg text-[#666] hover:text-white hover:bg-white/5 transition-colors">
                    <Bell className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#730404] rounded-full" />
                </button>
                <div className="ml-1 md:ml-2 w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-[#730404]/50">
                    <Image
                        src="/lcl-logo.png"
                        alt="LCL"
                        width={32}
                        height={32}
                        className="w-7 h-7 md:w-8 md:h-8 object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
