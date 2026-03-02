'use client';

import React, { useMemo, useState } from 'react';
import { mockPipelineRuns } from '@/lib/mock-data';
import { PIPELINE_STATUS_CONFIG } from '@/lib/constants';
import type { PipelineRun, PipelineRunStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
    ArrowUpDown,
    Filter,
    CalendarClock,
    Play,
    Pause,
    RotateCcw,
    Square,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ExecutionHistoryProps {
    onSelectRun: (run: PipelineRun) => void;
}

type SortKey = 'startedAt' | 'completedAt' | 'campaignName' | 'status';

export function ExecutionHistory({ onSelectRun }: ExecutionHistoryProps) {
    const [statusFilter, setStatusFilter] = useState<PipelineRunStatus | 'all'>('all');
    const [sortKey, setSortKey] = useState<SortKey>('startedAt');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const runs = useMemo(() => {
        let data = [...mockPipelineRuns];
        if (statusFilter !== 'all') {
            data = data.filter((run) => run.status === statusFilter);
        }

        data.sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1;
            switch (sortKey) {
                case 'campaignName':
                    return a.campaignName.localeCompare(b.campaignName) * dir;
                case 'status':
                    return a.status.localeCompare(b.status) * dir;
                case 'completedAt': {
                    const aTime = a.completedAt?.getTime() ?? 0;
                    const bTime = b.completedAt?.getTime() ?? 0;
                    return (aTime - bTime) * dir;
                }
                case 'startedAt':
                default:
                    return (a.startedAt.getTime() - b.startedAt.getTime()) * dir;
            }
        });

        return data;
    }, [statusFilter, sortKey, sortDir]);

    function toggleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    }

    function formatDateTime(date: Date | undefined) {
        if (!date) return '—';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    }

    function handleActionClick(e: React.MouseEvent, run: PipelineRun, action: 'pause' | 'resume' | 'stop' | 'restart') {
        e.stopPropagation();
        // UI-only placeholder; real implementation would mutate state or call API
    }

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-[#22C55E]" />
                        <h2 className="text-lg font-semibold text-white">
                            Execution history
                        </h2>
                    </div>
                    <p className="text-xs text-[#666]">
                        Review past and active pipeline runs. Filter by status and inspect details
                        for troubleshooting and optimization.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-[#666]" />
                    <Select
                        value={statusFilter}
                        onValueChange={(val) =>
                            setStatusFilter(val as PipelineRunStatus | 'all')
                        }
                    >
                        <SelectTrigger className="h-8 w-[130px] bg-[#0a0a0a] border-[#222] text-xs text-[#a3a3a3]">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222] text-xs">
                            <SelectItem value="all">All statuses</SelectItem>
                            {(
                                Object.entries(PIPELINE_STATUS_CONFIG) as [
                                    PipelineRunStatus,
                                    (typeof PIPELINE_STATUS_CONFIG)[keyof typeof PIPELINE_STATUS_CONFIG]
                                ][]
                            ).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    <span className="inline-flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: config.color }}
                                        />
                                        {config.label}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1.2fr,0.9fr,0.9fr,0.8fr,0.7fr] gap-3 text-[11px] text-[#666] border-y border-[#1a1a1a] py-2 px-2">
                <button
                    type="button"
                    onClick={() => toggleSort('campaignName')}
                    className="inline-flex items-center gap-1 text-left hover:text-[#a3a3a3]"
                >
                    Campaign
                    <ArrowUpDown className="w-3 h-3" />
                </button>
                <button
                    type="button"
                    onClick={() => toggleSort('startedAt')}
                    className="inline-flex items-center gap-1 text-left hover:text-[#a3a3a3]"
                >
                    Started
                    <ArrowUpDown className="w-3 h-3" />
                </button>
                <button
                    type="button"
                    onClick={() => toggleSort('completedAt')}
                    className="inline-flex items-center gap-1 text-left hover:text-[#a3a3a3]"
                >
                    Completed
                    <ArrowUpDown className="w-3 h-3" />
                </button>
                <button
                    type="button"
                    onClick={() => toggleSort('status')}
                    className="inline-flex items-center gap-1 text-left hover:text-[#a3a3a3]"
                >
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                </button>
                <span className="text-right">Actions</span>
            </div>

            {/* Rows */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {runs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-xs text-[#666]">
                        <p>No pipeline runs match this filter yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#050505]">
                        {runs.map((run) => {
                            const statusConfig = PIPELINE_STATUS_CONFIG[run.status];
                            const totalLeads = run.leadIds.length || 1;
                            const replyRate = Math.round(
                                (run.metrics.meetingsBooked / totalLeads) * 100,
                            );

                            return (
                                <button
                                    key={run.id}
                                    type="button"
                                    onClick={() => onSelectRun(run)}
                                    className="w-full grid grid-cols-1 md:grid-cols-[1.2fr,0.9fr,0.9fr,0.8fr,0.7fr] gap-2 md:gap-3 items-center text-xs text-[#a3a3a3] px-2 py-2.5 hover:bg-[#0a0a0a] transition-colors cursor-pointer"
                                >
                                    <div className="flex flex-col items-start min-w-0">
                                        <span className="text-[11px] text-white truncate">
                                            {run.campaignName}
                                        </span>
                                        <span className="text-[10px] text-[#666]">
                                            {run.metrics.leadMagnetSent.toLocaleString()} LM •{' '}
                                            {run.leadIds.length} leads •{' '}
                                            {run.metrics.meetingsBooked} meetings ({replyRate}%)
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-[#a3a3a3]">
                                        {formatDateTime(run.startedAt)}
                                    </span>
                                    <span className="text-[10px] text-[#a3a3a3]">
                                        {formatDateTime(run.completedAt)}
                                    </span>
                                    <span
                                        className="inline-flex items-center justify-start gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full w-max"
                                        style={{
                                            color: statusConfig.color,
                                            backgroundColor: statusConfig.bgColor,
                                        }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                        {statusConfig.label}
                                    </span>
                                    <div className="flex items-center justify-end gap-1.5 text-[11px]">
                                        {run.status === 'running' && (
                                            <>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                                                    onClick={(e) =>
                                                        handleActionClick(e, run, 'pause')
                                                    }
                                                >
                                                    <Pause className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                                                    onClick={(e) =>
                                                        handleActionClick(e, run, 'stop')
                                                    }
                                                >
                                                    <Square className="w-3.5 h-3.5" />
                                                </Button>
                                            </>
                                        )}
                                        {run.status === 'paused' && (
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                                                onClick={(e) =>
                                                    handleActionClick(e, run, 'resume')
                                                }
                                            >
                                                <Play className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        {(run.status === 'completed' ||
                                            run.status === 'failed') && (
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                                                onClick={(e) =>
                                                    handleActionClick(e, run, 'restart')
                                                }
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

