'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockTasks } from '@/lib/mock-data';
import { TASK_PRIORITY_CONFIG } from '@/lib/constants';
import {
    CheckCircle2,
    Circle,
    Clock,
    AlertTriangle,
    ListChecks,
} from 'lucide-react';

function formatDueDate(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < -1) return `${Math.abs(diffDays)}d overdue`;
    if (diffDays === -1 || (diffDays === 0 && diffHours < 0)) return 'Overdue';
    if (diffDays === 0) return `${Math.max(diffHours, 0)}h left`;
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
}

function isOverdue(date: Date): boolean {
    return date.getTime() < Date.now();
}

export function TodayTasks() {
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

    // Show upcoming/overdue tasks (non-done), sorted by due date
    const activeTasks = mockTasks
        .filter((t) => t.status !== 'done')
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
        .slice(0, 6);

    const overdueTasks = activeTasks.filter((t) => isOverdue(t.dueDate));

    const toggleComplete = (id: string) => {
        setCompletedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-4 md:p-6 hover:border-[#333] transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
                        <ListChecks className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-white">Today&apos;s Tasks</h3>
                        <p className="text-xs text-[#666]">
                            {overdueTasks.length > 0 && (
                                <span className="text-[#EF4444]">{overdueTasks.length} overdue · </span>
                            )}
                            {activeTasks.length} upcoming
                        </p>
                    </div>
                </div>
            </div>

            {/* Tasks list */}
            <div className="flex flex-col gap-1 flex-1">
                {activeTasks.map((task) => {
                    const isCompleted = completedIds.has(task.id);
                    const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
                    const overdue = isOverdue(task.dueDate) && !isCompleted;

                    return (
                        <div
                            key={task.id}
                            className={cn(
                                'group flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                'hover:bg-[#0a0a0a]',
                                isCompleted && 'opacity-50',
                            )}
                        >
                            {/* Checkbox */}
                            <button
                                onClick={() => toggleComplete(task.id)}
                                className="mt-0.5 shrink-0 transition-transform duration-200 hover:scale-110"
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4.5 h-4.5 text-[#22C55E]" />
                                ) : (
                                    <Circle className="w-4.5 h-4.5 text-[#333] group-hover:text-[#666] transition-colors" />
                                )}
                            </button>

                            {/* Task info */}
                            <div className="flex-1 min-w-0">
                                <span
                                    className={cn(
                                        'text-sm text-white block truncate',
                                        isCompleted && 'line-through text-[#666]',
                                    )}
                                >
                                    {task.title}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    {/* Priority badge */}
                                    <span
                                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                        style={{
                                            color: priorityConfig.color,
                                            backgroundColor: priorityConfig.bgColor,
                                        }}
                                    >
                                        {priorityConfig.label}
                                    </span>

                                    {/* Due date */}
                                    <span
                                        className={cn(
                                            'text-[10px] flex items-center gap-1 font-mono',
                                            overdue ? 'text-[#EF4444]' : 'text-[#666]',
                                        )}
                                    >
                                        {overdue ? (
                                            <AlertTriangle className="w-2.5 h-2.5" />
                                        ) : (
                                            <Clock className="w-2.5 h-2.5" />
                                        )}
                                        {formatDueDate(task.dueDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
                <button className="text-xs text-[#730404] hover:text-[#b91c1c] transition-colors font-medium">
                    View all tasks →
                </button>
            </div>
        </div>
    );
}
