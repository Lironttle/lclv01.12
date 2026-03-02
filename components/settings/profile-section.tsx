 'use client';

import React, { useCallback, useState } from 'react';
import { Clock3, Mail, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type Profile = {
    name: string;
    email: string;
    role: string;
    timezone: string;
};

type NotificationPrefs = {
    outreachReplies: boolean;
    dailyDigest: boolean;
    pipelineAlerts: boolean;
};

const INITIAL_PROFILE: Profile = {
    name: 'LCL Automation',
    email: 'ops@lcl-automation.com',
    role: 'Founder / Operator',
    timezone: 'Europe/Vilnius',
};

const INITIAL_PREFS: NotificationPrefs = {
    outreachReplies: true,
    dailyDigest: true,
    pipelineAlerts: true,
};

export function ProfileSection() {
    const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
    const [prefs, setPrefs] = useState<NotificationPrefs>(INITIAL_PREFS);
    const [saving, setSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<Date | null>(null);

    const updateProfileField = useCallback(
        (field: keyof Profile, value: string) => {
            setProfile((prev) => ({ ...prev, [field]: value }));
        },
        [],
    );

    const togglePref = useCallback((field: keyof NotificationPrefs, value: boolean) => {
        setPrefs((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSave = useCallback(async () => {
        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 450));
        setSaving(false);
        setSavedAt(new Date());
    }, []);

    const lastSavedLabel = savedAt != null
        ? 'Last updated ' + savedAt.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
          })
        : 'Changes are saved locally for this demo.';

    return (
        <section className="rounded-xl bg-[#111] border border-[#222] p-6 space-y-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#333] flex items-center justify-center overflow-hidden">
                        <UserCircle2 className="w-6 h-6 text-[#a3a3a3]" />
                    </div>
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-white">
                            Profile & Preferences
                        </h2>
                        <p className="text-xs text-[#666] mt-0.5">
                            Control how LCL Portal identifies you across dashboards and
                            notifications.
                        </p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-1 text-[11px] text-[#555]">
                    <Clock3 className="w-3.5 h-3.5" />
                    <span>{lastSavedLabel}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="profile-name"
                            className="text-[11px] uppercase tracking-wide text-[#777]"
                        >
                            Name
                        </Label>
                        <Input
                            id="profile-name"
                            value={profile.name}
                            onChange={(e) => updateProfileField('name', e.target.value)}
                            className="bg-[#050505] border-[#222] text-sm text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                            placeholder="Your name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="profile-role"
                            className="text-[11px] uppercase tracking-wide text-[#777]"
                        >
                            Role / Title
                        </Label>
                        <Input
                            id="profile-role"
                            value={profile.role}
                            onChange={(e) => updateProfileField('role', e.target.value)}
                            className="bg-[#050505] border-[#222] text-sm text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                            placeholder="e.g. Founder, Operator"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="profile-email"
                            className="text-[11px] uppercase tracking-wide text-[#777]"
                        >
                            Email
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]">
                                <Mail className="w-3.5 h-3.5" />
                            </span>
                            <Input
                                id="profile-email"
                                type="email"
                                value={profile.email}
                                onChange={(e) => updateProfileField('email', e.target.value)}
                                className="pl-9 bg-[#050505] border-[#222] text-sm text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                                placeholder="you@company.com"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label
                            htmlFor="profile-timezone"
                            className="text-[11px] uppercase tracking-wide text-[#777]"
                        >
                            Timezone
                        </Label>
                        <select
                            id="profile-timezone"
                            value={profile.timezone}
                            onChange={(e) => updateProfileField('timezone', e.target.value)}
                            className="w-full bg-[#050505] border border-[#222] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#730404]"
                        >
                            <option value="Europe/Vilnius">(GMT+2) Europe / Vilnius</option>
                            <option value="Europe/London">(GMT) Europe / London</option>
                            <option value="America/New_York">(GMT-5) America / New York</option>
                            <option value="America/Los_Angeles">
                                (GMT-8) America / Los Angeles
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-[#222] space-y-3">
                <p className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wide">
                    Notification preferences
                </p>
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#050505] border border-[#222] px-3 py-2.5">
                        <div>
                            <p className="text-xs text-white">Outreach replies</p>
                            <p className="text-[11px] text-[#666]">
                                Notify when contacts reply to outbound campaigns.
                            </p>
                        </div>
                        <Switch
                            checked={prefs.outreachReplies}
                            onCheckedChange={(value) => togglePref('outreachReplies', value)}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#050505] border border-[#222] px-3 py-2.5">
                        <div>
                            <p className="text-xs text-white">Daily digest</p>
                            <p className="text-[11px] text-[#666]">
                                Morning summary of leads, tasks, and pipeline changes.
                            </p>
                        </div>
                        <Switch
                            checked={prefs.dailyDigest}
                            onCheckedChange={(value) => togglePref('dailyDigest', value)}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#050505] border border-[#222] px-3 py-2.5">
                        <div>
                            <p className="text-xs text-white">Pipeline alerts</p>
                            <p className="text-[11px] text-[#666]">
                                Immediate alerts when critical automations fail.
                            </p>
                        </div>
                        <Switch
                            checked={prefs.pipelineAlerts}
                            onCheckedChange={(value) => togglePref('pipelineAlerts', value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className="flex md:hidden items-center gap-1 text-[11px] text-[#555]">
                    <Clock3 className="w-3.5 h-3.5" />
                    <span>{lastSavedLabel}</span>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 border-[#333] text-[#a3a3a3] hover:bg-[#222]"
                    >
                        Change Password
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                        className="h-8 px-4 bg-[#730404] text-white hover:bg-[#8b1a1a] disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </Button>
                </div>
            </div>
        </section>
    );
}
