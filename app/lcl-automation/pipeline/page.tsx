'use client';

import React, { useState } from 'react';
import { mockPipelineRuns } from '@/lib/mock-data';
import type { PipelineRun } from '@/lib/types';
import { PipelineVisual } from '@/components/pipeline/pipeline-visual';
import { NewRunForm } from '@/components/pipeline/new-run-form';
import { ExecutionHistory } from '@/components/pipeline/execution-history';
import { RunDetailsDialog } from '@/components/pipeline/run-details-dialog';
import { PIPELINE_STAGES } from '@/lib/constants';

type PipelineStageKey = (typeof PIPELINE_STAGES)[number]['key'];

export default function PipelinePage() {
    const [selectedStage, setSelectedStage] = useState<PipelineStageKey | 'all'>('all');
    const [selectedRun, setSelectedRun] = useState<PipelineRun | null>(
        mockPipelineRuns[0] ?? null,
    );
    const [detailsOpen, setDetailsOpen] = useState(false);

    function handleSelectRun(run: PipelineRun) {
        setSelectedRun(run);
        setDetailsOpen(true);
    }

    function handleCreateRun(run: PipelineRun) {
        setSelectedRun(run);
        setDetailsOpen(true);
    }

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                        LMLFM Pipeline
                    </h1>
                    <p className="text-xs md:text-sm text-[#666] mt-1 max-w-2xl">
                        Orchestrate your lead magnet → lead → follow-up → meeting pipeline. Monitor
                        runs, launch new campaigns, and inspect performance at each stage.
                    </p>
                </div>
            </div>

            {/* Top row: visual + new run */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.5fr,1.1fr] gap-4 xl:gap-6">
                <PipelineVisual
                    selectedStage={selectedStage}
                    onStageChange={setSelectedStage}
                    onSelectRun={handleSelectRun}
                />
                <NewRunForm onCreateRun={handleCreateRun} />
            </div>

            {/* Bottom row: execution history */}
            <ExecutionHistory onSelectRun={handleSelectRun} />

            {/* Details dialog */}
            <RunDetailsDialog
                run={selectedRun}
                open={detailsOpen && !!selectedRun}
                onOpenChange={setDetailsOpen}
            />
        </div>
    );
}

