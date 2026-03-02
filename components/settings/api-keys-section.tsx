 'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { KeyRound, Plus, Trash2, Pencil, Copy, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

type ApiServiceId = 'openai' | 'anthropic' | 'make' | 'zapier';

type ApiKeyRecord = {
    id: string;
    service: ApiServiceId;
    label: string;
    description: string;
    key: string;
    lastUpdated: Date | null;
};

const SERVICE_META: Record<ApiServiceId, { label: string; description: string }> = {
    openai: {
        label: 'OpenAI',
        description: 'Models for content generation and AI agents.',
    },
    anthropic: {
        label: 'Anthropic',
        description: 'Claude models for long-form reasoning and automation.',
    },
    make: {
        label: 'Make',
        description: 'Scenario-based automations and integrations.',
    },
    zapier: {
        label: 'Zapier',
        description: 'No-code automations connected to your stack.',
    },
};

const INITIAL_KEYS: ApiKeyRecord[] = [
    {
        id: 'openai',
        service: 'openai',
        label: SERVICE_META.openai.label,
        description: SERVICE_META.openai.description,
        key: 'sk-live-openai-sample-key',
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        id: 'anthropic',
        service: 'anthropic',
        label: SERVICE_META.anthropic.label,
        description: SERVICE_META.anthropic.description,
        key: 'sk-live-anthropic-sample-key',
        lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
];

function maskKey(key: string): string {
    if (!key) return 'Not set';
    if (key.length <= 8) return '•'.repeat(Math.max(4, key.length));
    const last4 = key.slice(-4);
    return `•••• •••• •••• ${last4}`;
}

function formatLastUpdated(date: Date | null): string {
    if (!date) return 'Never connected';
    return `Updated ${date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })}`;
}

export function ApiKeysSection() {
    const [keys, setKeys] = useState<ApiKeyRecord[]>(INITIAL_KEYS);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftKey, setDraftKey] = useState('');
    const [newService, setNewService] = useState<ApiServiceId | ''>('');
    const [newKey, setNewKey] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const availableServices = useMemo(() => {
        const used = new Set(keys.map((k) => k.service));
        return (['openai', 'anthropic', 'make', 'zapier'] as ApiServiceId[]).filter(
            (s) => !used.has(s),
        );
    }, [keys]);

    const handleStartEdit = useCallback((record: ApiKeyRecord) => {
        setEditingId(record.id);
        setDraftKey(record.key);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingId(null);
        setDraftKey('');
    }, []);

    const handleSaveEdit = useCallback(() => {
        if (!editingId) return;
        setKeys((prev) =>
            prev.map((k) =>
                k.id === editingId
                    ? {
                          ...k,
                          key: draftKey.trim(),
                          lastUpdated: draftKey.trim() ? new Date() : k.lastUpdated,
                      }
                    : k,
            ),
        );
        setEditingId(null);
        setDraftKey('');
    }, [draftKey, editingId]);

    const handleDelete = useCallback((id: string) => {
        setKeys((prev) => prev.filter((k) => k.id !== id));
        if (editingId === id) {
            setEditingId(null);
            setDraftKey('');
        }
    }, [editingId]);

    const handleAdd = useCallback(() => {
        if (!newService || !newKey.trim()) return;
        const meta = SERVICE_META[newService];
        const id = newService;
        setKeys((prev) => [
            ...prev,
            {
                id,
                service: newService,
                label: meta.label,
                description: meta.description,
                key: newKey.trim(),
                lastUpdated: new Date(),
            },
        ]);
        setNewService('');
        setNewKey('');
    }, [newKey, newService]);

    const handleCopy = useCallback(async (record: ApiKeyRecord) => {
        if (!record.key) return;
        try {
            await navigator.clipboard.writeText(record.key);
            setCopiedId(record.id);
            setTimeout(() => setCopiedId((current) => (current === record.id ? null : current)), 1200);
        } catch {
            // ignore clipboard errors in mock environment
        }
    }, []);

    return (
        <section className="rounded-xl bg-[#111] border border-[#222] p-6 card-glow space-y-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#730404]/15 flex items-center justify-center">
                            <KeyRound className="w-4 h-4 text-[#f97316]" />
                        </div>
                        <h2 className="text-base md:text-lg font-semibold text-white">
                            API Keys
                        </h2>
                    </div>
                    <p className="text-xs md:text-sm text-[#666] mt-1 max-w-xl">
                        Manage credentials for AI providers and automation tools. Keys are stored
                        only in this local demo and are masked in the UI.
                    </p>
                </div>
                <Badge variant="outline" className="border-[#333] text-[10px] uppercase tracking-wide text-[#a3a3a3] bg-[#0a0a0a]">
                    <ShieldCheck className="w-3 h-3 mr-1 text-[#22C55E]" />
                    Sample config
                </Badge>
            </div>

            <div className="space-y-3">
                {keys.length === 0 && (
                    <div className="rounded-lg border border-dashed border-[#333] bg-[#0a0a0a] p-4 text-xs text-[#666] text-center">
                        No API keys configured yet. Use the form below to add a provider.
                    </div>
                )}

                {keys.map((record) => {
                    const isEditing = editingId === record.id;
                    return (
                        <div
                            key={record.id}
                            className="rounded-lg border border-[#222] bg-[#0b0b0b] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[#333] hover:bg-[#111] transition-all duration-200"
                        >
                            <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-white">
                                        {record.label}
                                    </p>
                                    <span className="text-[10px] uppercase tracking-wide text-[#666]">
                                        {record.service.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-xs text-[#666] line-clamp-2">
                                    {record.description}
                                </p>
                                {isEditing ? (
                                    <div className="mt-2 space-y-1.5">
                                        <Label
                                            htmlFor={`api-key-${record.id}`}
                                            className="text-[10px] uppercase tracking-wide text-[#777]"
                                        >
                                            API Key
                                        </Label>
                                        <Input
                                            id={`api-key-${record.id}`}
                                            value={draftKey}
                                            onChange={(e) => setDraftKey(e.target.value)}
                                            placeholder="sk-live-..."
                                            className="bg-[#050505] border-[#222] text-xs text-white placeholder:text-[#444] focus-visible:ring-[#730404] font-mono"
                                        />
                                        <p className="text-[10px] text-[#555]">
                                            Keys are kept in memory only in this mock demo.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                        <p className="text-xs font-mono text-[#e5e5e5]">
                                            {maskKey(record.key)}
                                        </p>
                                        <span className="text-[11px] text-[#555]">
                                            {formatLastUpdated(record.lastUpdated)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 self-stretch sm:self-auto">
                                {isEditing ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                            className="h-8 px-3 border-[#333] text-[#a3a3a3] hover:bg-[#222]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSaveEdit}
                                            className="h-8 px-3 bg-[#730404] hover:bg-[#8b1a1a] text-white"
                                        >
                                            Save
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleCopy(record)}
                                            className="h-8 w-8 text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleStartEdit(record)}
                                            className="h-8 w-8 text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDelete(record.id)}
                                            className="h-8 w-8 text-[#a3a3a3] hover:text-[#EF4444] hover:bg-[#221010]"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </>
                                )}
                            </div>

                            {copiedId === record.id && !isEditing && (
                                <span className="text-[10px] text-[#22C55E] sm:hidden">
                                    Copied
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#222] space-y-3">
                <p className="text-xs font-medium text-[#a3a3a3] uppercase tracking-wide">
                    Add new API key
                </p>
                <div className="flex flex-col md:flex-row gap-3 md:items-end">
                    <div className="flex-1 space-y-1.5">
                        <Label className="text-[11px] uppercase tracking-wide text-[#777]">
                            Service
                        </Label>
                        <div className="relative">
                            <select
                                value={newService}
                                onChange={(e) => setNewService(e.target.value as ApiServiceId | '')}
                                className="w-full bg-[#050505] border border-[#222] rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#730404]"
                            >
                                <option value="">Select provider…</option>
                                {availableServices.map((id) => (
                                    <option key={id} value={id}>
                                        {SERVICE_META[id].label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex-[2] space-y-1.5">
                        <Label className="text-[11px] uppercase tracking-wide text-[#777]">
                            API Key
                        </Label>
                        <Input
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            placeholder="sk-live-..."
                            className="bg-[#050505] border-[#222] text-xs text-white placeholder:text-[#444] focus-visible:ring-[#730404] font-mono"
                        />
                    </div>
                    <Button
                        size="sm"
                        onClick={handleAdd}
                        disabled={!newService || !newKey.trim()}
                        className="h-9 md:h-8 px-3 bg-[#730404] hover:bg-[#8b1a1a] text-white flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-xs">Add</span>
                    </Button>
                </div>
                <p className="text-[10px] text-[#555]">
                    This section is purely for UI/UX — real deployments should store secrets in a
                    secure vault (e.g. environment variables or a secrets manager).
                </p>
            </div>
        </section>
    );
}

