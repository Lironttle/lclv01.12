'use client';

import React, { useState } from 'react';
import { mockLeads, mockPipelineRuns } from '@/lib/mock-data';
import type { PipelineRun } from '@/lib/types';
import { COLORS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarDays, ChevronsUpDown, Check, Sparkles, Clock } from 'lucide-react';

interface NewRunFormProps {
    onCreateRun?: (run: PipelineRun) => void;
}

export function NewRunForm({ onCreateRun }: NewRunFormProps) {
    const [openLeadPicker, setOpenLeadPicker] = useState(false);
    const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>(
        mockLeads.slice(0, 3).map((l) => l.id),
    );
    const [campaignName, setCampaignName] = useState('Q2 LinkedIn Warm-Up');
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [templatePreset, setTemplatePreset] = useState<'aggressive' | 'balanced' | 'gentle'>(
        'balanced',
    );
    const [sendingWindow, setSendingWindow] = useState<'morning' | 'business' | 'evening'>(
        'business',
    );
    const [isStarting, setIsStarting] = useState(false);

    const selectedLeads = mockLeads.filter((l) => selectedLeadIds.includes(l.id));

    function toggleLead(id: string) {
        setSelectedLeadIds((prev) =>
            prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id],
        );
    }

    function handleStartRun() {
        if (!startDate || selectedLeadIds.length === 0 || !campaignName.trim()) return;

        setIsStarting(true);

        const newRun: PipelineRun = {
            id: `pr-${mockPipelineRuns.length + 1}`,
            campaignName: campaignName.trim(),
            status: 'running',
            leadIds: selectedLeadIds,
            startedAt: startDate,
            metrics: {
                leadMagnetSent: selectedLeadIds.length * 10,
                leadsGenerated: selectedLeadIds.length,
                followUpsSent: Math.floor(selectedLeadIds.length * 0.7),
                meetingsBooked: Math.max(1, Math.floor(selectedLeadIds.length * 0.25)),
            },
        };

        onCreateRun?.(newRun);

        setTimeout(() => {
            setIsStarting(false);
        }, 600);
    }

    function handleSaveDraft() {
        // No-op placeholder for now – could hook into persistence later
    }

    const disabled = !campaignName.trim() || !startDate || selectedLeadIds.length === 0;

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-6 h-full flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                        New Pipeline Run
                    </h2>
                    <p className="text-xs text-[#666] mt-1 max-w-sm">
                        Configure a new LMLFM pipeline run. Select leads, choose a template preset,
                        and set timing before launching.
                    </p>
                </div>
                <div className="hidden md:flex flex-col items-end text-[11px] text-[#a3a3a3] font-mono gap-0.5">
                    <span>
                        {mockPipelineRuns.length} configured run
                        {mockPipelineRuns.length !== 1 ? 's' : ''}
                    </span>
                    <span>{mockLeads.length} total leads</span>
                </div>
            </div>

            <div className="space-y-4">
                {/* Campaign name */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="pipeline-campaign-name"
                        className="text-xs font-medium text-[#a3a3a3]"
                    >
                        Campaign name
                    </label>
                    <Input
                        id="pipeline-campaign-name"
                        placeholder="e.g. Q2 SaaS Founders, Event Follow-up"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="bg-[#0a0a0a] border-[#222] text-sm text-white placeholder:text-[#555] focus-visible:ring-[#730404]"
                    />
                </div>

                {/* Lead selection */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#a3a3a3]">
                        Lead selection
                    </label>
                    <Popover open={openLeadPicker} onOpenChange={setOpenLeadPicker}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    'w-full inline-flex items-center justify-between rounded-md border px-3 py-2 text-xs',
                                    'bg-[#0a0a0a] border-[#222] text-[#a3a3a3] hover:bg-[#111] transition-colors',
                                )}
                            >
                                <span className="truncate text-left">
                                    {selectedLeads.length === 0
                                        ? 'Select leads to include...'
                                        : `${selectedLeads.length} lead${
                                              selectedLeads.length !== 1 ? 's' : ''
                                          } selected`}
                                </span>
                                <ChevronsUpDown className="ml-2 h-3 w-3 text-[#555]" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-0 bg-[#050505] border-[#222]">
                            <Command className="bg-transparent">
                                <CommandInput
                                    placeholder="Search leads..."
                                    className="h-9 text-xs bg-[#050505] border-b border-[#111]"
                                />
                                <CommandEmpty className="py-4 text-xs text-[#666]">
                                    No leads found.
                                </CommandEmpty>
                                <CommandGroup className="max-h-[220px] overflow-y-auto custom-scrollbar">
                                    {mockLeads.map((lead) => {
                                        const isSelected = selectedLeadIds.includes(lead.id);
                                        return (
                                            <CommandItem
                                                key={lead.id}
                                                value={`${lead.name} ${lead.company}`}
                                                className="flex items-center justify-between text-xs px-3 py-1.5"
                                                onSelect={() => toggleLead(lead.id)}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] text-white">
                                                        {lead.name}
                                                    </span>
                                                    <span className="text-[10px] text-[#666]">
                                                        {lead.company}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <Check className="w-3 h-3 text-[#22C55E]" />
                                                )}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <p className="text-[10px] text-[#555]">
                        We recommend starting with 20–50 leads per run for best reply rates.
                    </p>
                </div>

                {/* Start date + sending window */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#a3a3a3] flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5 text-[#666]" />
                            Start date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal text-xs',
                                        'bg-[#0a0a0a] border-[#222] text-white hover:bg-[#111] hover:border-[#333]',
                                    )}
                                >
                                    {startDate ? (
                                        startDate.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })
                                    ) : (
                                        <span className="text-[#555]">Pick a start date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-[#050505] border-[#222]">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    className="bg-[#050505] text-white"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[#a3a3a3] flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#666]" />
                            Sending window
                        </label>
                        <div className="flex items-center gap-1 bg-[#0a0a0a] border border-[#222] rounded-lg p-1">
                            {(
                                [
                                    ['morning', '9–11am'],
                                    ['business', '9am–5pm'],
                                    ['evening', '5–8pm'],
                                ] as const
                            ).map(([key, label]) => {
                                const isActive = sendingWindow === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setSendingWindow(key)}
                                        className={cn(
                                            'flex-1 text-[11px] px-2 py-1 rounded-md transition-all',
                                            isActive
                                                ? 'bg-[#730404] text-white shadow-sm'
                                                : 'text-[#666] hover:text-white hover:bg-[#111]',
                                        )}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Template presets */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#a3a3a3]">
                        Template preset
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(
                            [
                                [
                                    'gentle',
                                    'Gentle nurture',
                                    'Low frequency, relationship-first follow-ups.',
                                ],
                                [
                                    'balanced',
                                    'Balanced',
                                    'Optimized timing for replies without being pushy.',
                                ],
                                [
                                    'aggressive',
                                    'Aggressive',
                                    'High-touch campaign for short launch windows.',
                                ],
                            ] as const
                        ).map(([key, title, desc]) => {
                            const isActive = templatePreset === key;
                            const color =
                                key === 'gentle'
                                    ? COLORS.info
                                    : key === 'balanced'
                                        ? COLORS.warning
                                        : COLORS.error;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setTemplatePreset(key)}
                                    className={cn(
                                        'text-left rounded-lg border px-3 py-2.5 transition-all h-full',
                                        'bg-[#0a0a0a] border-[#222] hover:bg-[#111] hover:border-[#333]',
                                        isActive &&
                                            'border-[#730404] shadow-[0_0_0_1px_rgba(115,4,4,0.6)]',
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-xs font-semibold text-white">
                                            {title}
                                        </span>
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-[#666] leading-snug">{desc}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1 text-[10px] text-[#666]">
                    {!disabled ? (
                        <p>
                            Ready to start. This run will send{' '}
                            <span className="text-[#a3a3a3] font-mono">
                                {selectedLeadIds.length * 10}
                            </span>{' '}
                            lead magnet emails using the <span className="text-[#a3a3a3]">
                                {templatePreset}
                            </span>{' '}
                            preset.
                        </p>
                    ) : (
                        <p>Fill in campaign name, select at least one lead, and choose a date.</p>
                    )}
                </div>
                <div className="flex items-center gap-2 justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveDraft}
                        className="text-xs text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                    >
                        Save draft
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        disabled={disabled || isStarting}
                        onClick={handleStartRun}
                        className={cn(
                            'text-xs font-semibold px-4',
                            'bg-[#730404] hover:bg-[#8b1a1a] text-white shadow-[0_0_20px_rgba(115,4,4,0.5)]',
                        )}
                    >
                        {isStarting ? 'Starting…' : 'Start run'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

