 'use client';

import { Settings } from 'lucide-react';
import { ApiKeysSection } from '@/components/settings/api-keys-section';
import { N8nConnection } from '@/components/settings/n8n-connection';
import { ProfileSection } from '@/components/settings/profile-section';

export default function SettingsPage() {
    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#111] border border-[#222] shadow-inner shadow-black/40">
                        <Settings className="w-4 h-4 text-[#730404]" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold text-white">
                            Settings & Configuration
                        </h1>
                        <p className="text-sm text-[#666] mt-1 max-w-2xl">
                            Manage API keys, n8n connectivity, and your profile from a single,
                            dark-mode friendly control center.
                        </p>
                    </div>
                </div>
                <div className="text-xs text-[#555] font-mono md:text-right">
                    <p>LCL Portal · Internal tools</p>
                    <p className="mt-0.5">Phase 10 · Settings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.6fr,1.1fr] gap-5 items-start">
                <div className="space-y-4">
                    <ApiKeysSection />
                    <N8nConnection />
                </div>
                <div className="space-y-4">
                    <ProfileSection />
                </div>
            </div>
        </div>
    );
}
