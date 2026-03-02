 'use client';

import React, { useCallback, useState } from 'react';
import { Globe2, Link2, Loader2, PlugZap, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

type ConnectionStatus = 'disconnected' | 'connected' | 'testing' | 'error';

export function N8nConnection() {
    const [url, setUrl] = useState('https://n8n.lcl-automation.local');
    const [apiKey, setApiKey] = useState('');
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [message, setMessage] = useState<string | null>(
        'Connect your n8n instance to orchestrate complex workflows.',
    );

    const statusConfig: Record<
        ConnectionStatus,
        { label: string; color: string; bg: string }
    > = {
        disconnected: {
            label: 'Disconnected',
            color: '#F97316',
            bg: 'rgba(249, 115, 22, 0.15)',
        },
        connected: {
            label: 'Connected',
            color: '#22C55E',
            bg: 'rgba(34, 197, 94, 0.15)',
        },
        testing: {
            label: 'Testing',
            color: '#3B82F6',
            bg: 'rgba(59, 130, 246, 0.15)',
        },
        error: {
            label: 'Error',
            color: '#EF4444',
            bg: 'rgba(239, 68, 68, 0.15)',
        },
    };

    const canSubmit = url.trim().length > 0 && apiKey.trim().length > 0;

    const simulateNetworkDelay = () =>
        new Promise<void>((resolve) => setTimeout(resolve, 650));

    const handleTestConnection = useCallback(async () => {
        if (!canSubmit) return;
        setStatus('testing');
        setMessage('Testing connection to your n8n instance…');
        await simulateNetworkDelay();

        const isOk = url.toLowerCase().startsWith('https://') && apiKey.length > 10;
        if (isOk) {
            setStatus('connected');
            setMessage('Connection successful. Webhooks and runs can now be synced.');
        } else {
            setStatus('error');
            setMessage(
                'Unable to reach n8n with the provided values. Double-check the URL and API key.',
            );
        }
    }, [apiKey.length, canSubmit, url]);

    const handleSave = useCallback(async () => {
        if (!canSubmit) return;
        setStatus('testing');
        setMessage('Saving connection details…');
        await simulateNetworkDelay();
        setStatus('connected');
        setMessage('Connection details saved locally for this demo session.');
    }, [canSubmit]);

    const handleDisconnect = useCallback(async () => {
        setStatus('disconnected');
        setMessage('Disconnected from n8n. No further runs will be synced.');
    }, []);

    const currentStatus = statusConfig[status];

    return (
        <section className="rounded-xl bg-[#111] border border-[#222] p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center">
                            <PlugZap className="w-4 h-4 text-[#38bdf8]" />
                        </div>
                        <h2 className="text-base md:text-lg font-semibold text-white">
                            n8n Connection
                        </h2>
                    </div>
                    <p className="text-xs md:text-sm text-[#666] mt-1 max-w-xl">
                        Configure your self-hosted or cloud n8n instance to power LCL&apos;s
                        automation pipelines.
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className="flex items-center gap-1 border-transparent text-[10px] uppercase tracking-wide"
                    style={{
                        color: currentStatus.color,
                        backgroundColor: currentStatus.bg,
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: currentStatus.color }}
                    />
                    {currentStatus.label}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label
                        htmlFor="n8n-url"
                        className="text-[11px] uppercase tracking-wide text-[#777]"
                    >
                        Instance URL
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]">
                            <Globe2 className="w-3.5 h-3.5" />
                        </span>
                        <Input
                            id="n8n-url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://n8n.your-domain.com"
                            className="pl-9 bg-[#050505] border-[#222] text-xs text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                        />
                    </div>
                    <p className="text-[10px] text-[#555]">
                        Use the public base URL for your n8n instance. HTTPS is recommended.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label
                        htmlFor="n8n-api-key"
                        className="text-[11px] uppercase tracking-wide text-[#777]"
                    >
                        API Key
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]">
                            <Link2 className="w-3.5 h-3.5" />
                        </span>
                        <Input
                            id="n8n-api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter personal access token"
                            className="pl-9 bg-[#050505] border-[#222] text-xs text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                        />
                    </div>
                    <p className="text-[10px] text-[#555]">
                        Create a personal access token in n8n and paste it here.
                    </p>
                </div>
            </div>

            {message && (
                <div className="flex items-start gap-2 text-[11px] text-[#a3a3a3]">
                    {status === 'error' ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444] mt-0.5" />
                    ) : (
                        <PlugZap className="w-3.5 h-3.5 text-[#38bdf8] mt-0.5" />
                    )}
                    <p className="leading-relaxed">{message}</p>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-2 justify-end pt-2 border-t border-[#222] mt-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnect}
                    className="h-8 px-3 text-[#a3a3a3] hover:bg-[#221010] hover:text-[#fca5a5]"
                >
                    Disconnect
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!canSubmit || status === 'testing'}
                    onClick={handleTestConnection}
                    className="h-8 px-3 border-[#333] text-[#a3a3a3] hover:bg-[#222]"
                >
                    {status === 'testing' ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            Testing…
                        </>
                    ) : (
                        'Test Connection'
                    )}
                </Button>
                <Button
                    size="sm"
                    disabled={!canSubmit || status === 'testing'}
                    onClick={handleSave}
                    className="h-8 px-3 bg-[#730404] hover:bg-[#8b1a1a] text-white"
                >
                    Save Connection
                </Button>
            </div>
        </section>
    );
}

