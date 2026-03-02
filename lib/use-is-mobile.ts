'use client';

import { useEffect, useState } from 'react';

/** Returns true when viewport is below 768px (md breakpoint). */
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia('(max-width: 767px)');
        setIsMobile(mql.matches);

        function onChange(e: MediaQueryListEvent) {
            setIsMobile(e.matches);
        }

        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return isMobile;
}
