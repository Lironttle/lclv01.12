'use client';

import React from 'react';
import { mockLeads, mockPipelineRuns } from '@/lib/mock-data';
import { PIPELINE_STAGES, PIPELINE_STATUS_CONFIG, COLORS } from '@/lib/constants';
import type { PipelineRun } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Users, Clock, Activity } from 'lucide-react';

type PipelineStageKey = (typeof PIPELINE_STAGES)[number]['key'];

interface PipelineVisualProps {
    selectedStage: PipelineStageKey | 'all';
    onStageChange: (stage: PipelineStageKey | 'all') => void;
    onSelectRun: (run: PipelineRun) => void;
}

function getStageMetrics() {
    const totalLeadMagnets = mockPipelineRuns.reduce(
        (sum, run) => sum + run.metrics.leadMagnetSent,
        0
    );
    const totalLeads = mockPipelineRuns.reduce(
        (sum, run) => sum + run.metrics.leadsGenerated,
        0
    );
    const totalFollowUps = mockPipelineRuns.reduce(
        (sum, run) => sum + run.metrics.followUpsSent,
        0
    );
    const totalMeetings = mockPipelineRuns.reduce(
        (sum, run) => sum + run.metrics.meetingsBooked,
        0
    );

    const stages = [
        {
            key: 'leadMagnet' as const,
            label: 'Lead Magnet',
            count: totalLeadMagnets,
            base: totalLeadMagnets || 1,
        },
        {
            key: 'lead' as const,
            label: 'Lead',
            count: totalLeads,
            base: totalLeadMagnets || 1,
        },
        {
            key: 'followUp' as const,
            label: 'Follow-up',
            count: totalFollowUps,
            base: totalLeads || 1,
        },
        {
            key: 'meeting' as const,
            label: 'Meeting',
            count: totalMeetings,
            base: totalFollowUps || 1,
        },
    ];

    return stages.map((stage) => ({
        ...stage,
        successRate: Math.min(100, Math.round((stage.count / stage.base) * 100)),
        avgTime: stage.key === 'leadMagnet'
            ? '—'
            : stage.key === 'lead'
                ? '1-2 days'
                : stage.key === 'followUp'
                    ? '3-5 days'
                    : '7-10 days',
    }));
}

export function PipelineVisual({
    selectedStage,
    onStageChange,
    onSelectRun,
}: PipelineVisualProps) {
    const stageMetrics = getStageMetrics();

    const totalLeads = mockLeads.length;
    const activeRuns = mockPipelineRuns.filter((r) => r.status === 'running').length;

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#730404]" />
                        LMLFM Pipeline
                    </h2>
                    <p className="text-xs text-[#666] mt-1 max-w-xl">
                        Visualize how leads move from lead magnet to booked meetings. Click a stage
                        to focus metrics and filter related runs.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-xs text-[#a3a3a3] font-mono">
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#666]" />
                        <span>{totalLeads} active leads</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{activeRuns} active run{activeRuns !== 1 ? 's' : ''}</span>
                    </span>
                </div>
            </div>

            {/* Stages flow */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {stageMetrics.map((stage, index) => {
                    const isActive = selectedStage === stage.key || selectedStage === 'all';
                    const isSelected = selectedStage === stage.key;

                    const widthPercent =
                        stage.key === 'leadMagnet'
                            ? 100
                            : stage.key === 'lead'
                                ? 80
                                : stage.key === 'followUp'
                                    ? 55
                                    : 35;

                    const accentColor =
                        stage.key === 'leadMagnet'
                            ? COLORS.info
                            : stage.key === 'lead'
                                ? '#8B5CF6'
                                : stage.key === 'followUp'
                                    ? COLORS.warning
                                    : COLORS.success;

                    return (
                        <button
                            key={stage.key}
                            type="button"
                            onClick={() =>
                                onStageChange(
                                    selectedStage === stage.key ? 'all' : (stage.key as PipelineStageKey),
                                )
                            }
                            className={cn(
                                'relative group flex flex-col gap-3 p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden',
                                'bg-[#0b0b0b]/80 hover:bg-[#111]',
                                isSelected
                                    ? 'border-[#730404] shadow-[0_0_0_1px_rgba(115,4,4,0.6)]'
                                    : 'border-[#222] hover:border-[#333] opacity-90',
                            )}
                        >
                            {/* Stage header */}
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#666] font-semibold">
                                        Stage {index + 1}
                                    </p>
                                    <p className="text-sm font-semibold text-white mt-0.5">
                                        {stage.label}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-full bg-[#0a0a0a] border border-[#1a1a1a] text-[#a3a3a3]">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: accentColor }}
                                        />
                                        {stage.count.toLocaleString()} events
                                    </span>
                                    <span className="text-[10px] text-[#666]">
                                        {stage.successRate}% success
                                    </span>
                                </div>
                            </div>

                            {/* Horizontal bar */}
                            <div className="relative mt-1.5">
                                <div className="h-2.5 w-full rounded-full bg-[#050505] border border-[#1a1a1a] overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#730404] via-[#b91c1c] to-[#f97316] shadow-[0_0_20px_rgba(248,113,113,0.45)] transition-all duration-700 ease-out"
                                        style={{
                                            width: `${widthPercent}%`,
                                            opacity: isActive ? 0.95 : 0.5,
                                        }}
                                    />
                                </div>
                                {/* Connector dot for multi-stage feel */}
                                {index < stageMetrics.length - 1 && (
                                    <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050505] border border-[#222] flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#730404] group-hover:scale-110 transition-transform" />
                                    </div>
                                )}
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-between gap-2 text-[11px] text-[#a3a3a3]">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#666]" />
                                    <span className="font-mono">
                                        Avg. time: {stage.avgTime}
                                    </span>
                                </div>
                                <span className="text-[#666]">
                                    Click to {isSelected ? 'reset filter' : 'drill into stage'}
                                </span>
                            </div>

                            {/* Glow background */}
                            <div
                                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background:
                                        'radial-gradient(circle at top, rgba(115,4,4,0.25), transparent 65%)',
                                }}
                            />
                        </button>
                    );
                })}
            </div>

            {/* Supporting runs list for context */}
            <div className="mt-auto pt-4 border-t border-[#1a1a1a]">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-[#a3a3a3] flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>
                            Key runs impacting{' '}
                            {selectedStage === 'all'
                                ? 'the entire pipeline'
                                : stageMetrics.find((s) => s.key === selectedStage)?.label ??
                                  'pipeline'}
                        </span>
                    </p>
                    <span className="text-[10px] text-[#666] font-mono">
                        {mockPipelineRuns.length} total runs
                    </span>
                </div>

                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                    {mockPipelineRuns.map((run) => {
                        const statusConfig = PIPELINE_STATUS_CONFIG[run.status];
                        const totalSteps =
                            run.metrics.leadMagnetSent +
                            run.metrics.leadsGenerated +
                            run.metrics.followUpsSent +
                            run.metrics.meetingsBooked;
                        const meetingsRate =
                            totalSteps === 0
                                ? 0
                                : Math.round((run.metrics.meetingsBooked / totalSteps) * 100);

                        return (
                            <button
                                key={run.id}
                                type="button"
                                onClick={() => onSelectRun(run)}
                                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[#0a0a0a] hover:bg-[#111] border border-[#1a1a1a] hover:border-[#333] transition-all duration-200 text-left"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-white truncate">
                                        {run.campaignName}
                                    </p>
                                    <p className="text-[10px] text-[#666] mt-0.5">
                                        {run.metrics.leadMagnetSent.toLocaleString()} LM →{' '}
                                        {run.metrics.meetingsBooked} meetings (
                                        {meetingsRate}
                                        %)
                                    </p>
                                </div>
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium"
                                    style={{
                                        color: statusConfig.color,
                                        backgroundColor: statusConfig.bgColor,
                                    }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {statusConfig.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

