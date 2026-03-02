'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { mockPipelineRuns } from '@/lib/mock-data';
import { PIPELINE_STATUS_CONFIG } from '@/lib/constants';
import {
    Play,
    Pause,
    CheckCircle2,
    AlertCircle,
    FileText,
    ExternalLink,
    Activity,
} from 'lucide-react';

const statusIconMap: Record<string, React.ElementType> = {
    running: Play,
    paused: Pause,
    completed: CheckCircle2,
    failed: AlertCircle,
    draft: FileText,
};

function formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PipelineStatus() {
    // Show only active/recent runs (limit 4)
    const runs = mockPipelineRuns
        .filter((r) => r.status !== 'draft')
        .slice(0, 4);

    const activeCount = mockPipelineRuns.filter((r) => r.status === 'running').length;

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-4 md:p-6 hover:border-[#333] transition-all duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-white">Pipeline</h3>
                        <p className="text-xs text-[#666]">
                            {activeCount} active run{activeCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* Runs list */}
            <div className="flex flex-col gap-3 flex-1">
                {runs.map((run) => {
                    const config = PIPELINE_STATUS_CONFIG[run.status];
                    const StatusIcon = statusIconMap[run.status] || FileText;
                    const totalMetric =
                        run.metrics.leadMagnetSent +
                        run.metrics.leadsGenerated +
                        run.metrics.followUpsSent +
                        run.metrics.meetingsBooked;

                    // Calculate a rough progress percentage
                    const progress = run.status === 'completed'
                        ? 100
                        : run.status === 'failed'
                            ? 0
                            : Math.min(
                                90,
                                Math.floor(
                                    ((run.metrics.meetingsBooked * 4 +
                                        run.metrics.followUpsSent * 2 +
                                        run.metrics.leadsGenerated) /
                                        Math.max(run.metrics.leadMagnetSent, 1)) *
                                    100
                                )
                            );

                    return (
                        <div
                            key={run.id}
                            className="group flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] hover:bg-[#111] transition-all duration-200 cursor-pointer"
                        >
                            {/* Status icon */}
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: config.bgColor }}
                            >
                                <StatusIcon
                                    className={cn(
                                        'w-3.5 h-3.5',
                                        run.status === 'running' && 'animate-pulse-subtle',
                                    )}
                                    style={{ color: config.color }}
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-white truncate">
                                        {run.campaignName}
                                    </span>
                                    <span className="text-[10px] text-[#666] whitespace-nowrap font-mono">
                                        {formatDate(run.startedAt)}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-1.5 flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700 ease-out"
                                            style={{
                                                width: `${progress}%`,
                                                backgroundColor: config.color,
                                                opacity: 0.8,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-[#666]">{progress}%</span>
                                </div>
                            </div>

                            {/* View button */}
                            <ExternalLink className="w-3.5 h-3.5 text-[#333] group-hover:text-[#666] transition-colors shrink-0" />
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
                <button className="text-xs text-[#730404] hover:text-[#b91c1c] transition-colors font-medium">
                    View all pipeline runs →
                </button>
            </div>
        </div>
    );
}
