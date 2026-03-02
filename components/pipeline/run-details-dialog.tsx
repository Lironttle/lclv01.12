'use client';

import React, { useMemo } from 'react';
import type { PipelineRun } from '@/lib/types';
import { PIPELINE_STAGES, PIPELINE_STATUS_CONFIG } from '@/lib/constants';
import { mockLeads } from '@/lib/mock-data';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    BadgeCheck,
    Clock,
    Mail,
    MessageSquare,
    Users,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

interface RunDetailsDialogProps {
    run: PipelineRun | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RunDetailsDialog({ run, open, onOpenChange }: RunDetailsDialogProps) {
    const statusConfig = run ? PIPELINE_STATUS_CONFIG[run.status] : null;

    const leads = useMemo(() => {
        if (!run) return [];
        return mockLeads.filter((lead) => run.leadIds.includes(lead.id));
    }, [run]);

    if (!run) return null;

    const totalSteps =
        run.metrics.leadMagnetSent +
        run.metrics.leadsGenerated +
        run.metrics.followUpsSent +
        run.metrics.meetingsBooked;

    const stageTimeline = [
        {
            key: 'leadMagnet',
            label: 'Lead magnet sent',
            count: run.metrics.leadMagnetSent,
            icon: Mail,
            description: 'Initial content delivered to cold/prospect audiences.',
        },
        {
            key: 'lead',
            label: 'Leads generated',
            count: run.metrics.leadsGenerated,
            icon: Users,
            description: 'Contacts who opted-in or replied with interest.',
        },
        {
            key: 'followUp',
            label: 'Follow-ups sent',
            count: run.metrics.followUpsSent,
            icon: MessageSquare,
            description: 'Nurture sequences and reminder messages.',
        },
        {
            key: 'meeting',
            label: 'Meetings booked',
            count: run.metrics.meetingsBooked,
            icon: BadgeCheck,
            description: 'Qualified calls scheduled on the calendar.',
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between gap-3">
                        <span className="flex flex-col gap-1">
                            <span className="text-sm text-[#a3a3a3] font-mono">
                                Run ID: {run.id}
                            </span>
                            <span className="text-base font-semibold">
                                {run.campaignName}
                            </span>
                        </span>
                        {statusConfig && (
                            <span
                                className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full"
                                style={{
                                    color: statusConfig.color,
                                    backgroundColor: statusConfig.bgColor,
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {statusConfig.label}
                            </span>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#777]">
                        Timeline of this pipeline run from lead magnet delivery to booked meetings.
                        Use this to debug performance and understand where leads are dropping off.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-[1.6fr,1.1fr] gap-4">
                    {/* Left: timeline */}
                    <ScrollArea className="h-[260px] pr-3">
                        <ol className="relative border-l border-[#222] ml-3 space-y-4">
                            {stageTimeline.map((stage, index) => {
                                const Icon = stage.icon;
                                const stageMeta = PIPELINE_STAGES[index];
                                const rate =
                                    totalSteps === 0
                                        ? 0
                                        : Math.round((stage.count / totalSteps) * 100);

                                return (
                                    <li key={stage.key} className="ml-2">
                                        <div className="absolute -left-[9px] mt-1.5 w-3.5 h-3.5 rounded-full bg-[#050505] border border-[#333] flex items-center justify-center">
                                            {index === stageTimeline.length - 1 ? (
                                                <CheckCircle2 className="w-2.5 h-2.5 text-[#22C55E]" />
                                            ) : (
                                                <AlertCircle className="w-2.5 h-2.5 text-[#666]" />
                                            )}
                                        </div>
                                        <div className="ml-4 p-3 rounded-lg bg-[#0b0b0b] border border-[#222]">
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-3.5 h-3.5 text-[#a3a3a3]" />
                                                    <span className="text-xs font-semibold text-white">
                                                        {stage.label}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] font-mono text-[#a3a3a3]">
                                                    {stage.count.toLocaleString()} events
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-[#777] mb-1">
                                                {stage.description}
                                            </p>
                                            {stageMeta && (
                                                <p className="text-[10px] text-[#555]">
                                                    LMLFM Stage:{' '}
                                                    <span className="text-[#a3a3a3] font-mono">
                                                        {stageMeta.label}
                                                    </span>{' '}
                                                    — {stageMeta.description}
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center justify-between gap-3">
                                                <div className="flex-1 h-1.5 rounded-full bg-[#050505] overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] via-[#F59E0B] to-[#22C55E]"
                                                        style={{ width: `${rate}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-[#a3a3a3] font-mono">
                                                    {rate}%
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </ScrollArea>

                    {/* Right: metrics & leads */}
                    <div className="flex flex-col gap-3">
                        <div className="rounded-lg bg-[#0b0b0b] border border-[#222] p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-[#a3a3a3]" />
                                    <span className="text-xs font-semibold text-white">
                                        Run metrics
                                    </span>
                                </div>
                                <span className="text-[10px] text-[#777] font-mono">
                                    {run.startedAt.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                    {run.completedAt
                                        ? ` → ${run.completedAt.toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                          })}`
                                        : ' • still running'}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#a3a3a3]">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-[#666]">Lead magnet</span>
                                    <span className="font-mono">
                                        {run.metrics.leadMagnetSent.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-[#666]">Leads</span>
                                    <span className="font-mono">
                                        {run.metrics.leadsGenerated.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-[#666]">Follow-ups</span>
                                    <span className="font-mono">
                                        {run.metrics.followUpsSent.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] text-[#666]">Meetings</span>
                                    <span className="font-mono">
                                        {run.metrics.meetingsBooked.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-[#0b0b0b] border border-[#222] p-3 flex-1 min-h-0">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-white">
                                    Included leads
                                </span>
                                <span className="text-[10px] text-[#777] font-mono">
                                    {leads.length} total
                                </span>
                            </div>
                            {leads.length === 0 ? (
                                <p className="text-[11px] text-[#666]">
                                    No leads associated with this run yet.
                                </p>
                            ) : (
                                <ScrollArea className="h-[135px]">
                                    <ul className="space-y-1.5 pr-1">
                                        {leads.map((lead) => (
                                            <li
                                                key={lead.id}
                                                className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-md bg-[#050505] border border-[#111]"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-[11px] text-white truncate">
                                                        {lead.name}
                                                    </p>
                                                    <p className="text-[10px] text-[#777] truncate">
                                                        {lead.company}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] text-[#666] font-mono">
                                                    {lead.status.toUpperCase()}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

