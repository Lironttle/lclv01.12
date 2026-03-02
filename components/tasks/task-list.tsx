'use client';

import React, { useMemo } from 'react';
import { TaskCard } from './task-card';
import { TASK_STATUS_CONFIG } from '@/lib/constants';
import type { Task, TaskStatus } from '@/lib/types';
import { Inbox } from 'lucide-react';

// --- Component ---
interface TaskListProps {
    tasks: Task[];
    groupBy?: 'status' | 'none';
    onToggleComplete?: (task: Task) => void;
    onEdit?: (task: Task) => void;
    onDelete?: (task: Task) => void;
}

const STATUS_ORDER: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

export function TaskList({
    tasks,
    groupBy = 'status',
    onToggleComplete,
    onEdit,
    onDelete,
}: TaskListProps) {
    // Group tasks by status
    const groupedTasks = useMemo(() => {
        if (groupBy === 'none') {
            return [{ key: 'all', label: 'All Tasks', tasks }];
        }

        return STATUS_ORDER.map((status) => ({
            key: status,
            label: TASK_STATUS_CONFIG[status].label,
            color: TASK_STATUS_CONFIG[status].color,
            tasks: tasks.filter((t) => t.status === status),
        })).filter((group) => group.tasks.length > 0);
    }, [tasks, groupBy]);

    if (tasks.length === 0) {
        return (
            <div className="rounded-xl bg-[#111] border border-[#222] p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <Inbox className="w-5 h-5 text-[#555]" />
                </div>
                <p className="text-[#666] text-sm">No tasks match your filters</p>
                <p className="text-[#444] text-xs">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    let globalIndex = 0;

    return (
        <div className="space-y-6">
            {groupedTasks.map((group) => (
                <div key={group.key} className="space-y-2">
                    {/* Group header */}
                    {groupBy !== 'none' && (
                        <div className="flex items-center gap-2 px-1">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: (group as { color?: string }).color }}
                            />
                            <span className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">
                                {group.label}
                            </span>
                            <span className="text-xs text-[#555] font-mono">
                                {group.tasks.length}
                            </span>
                            <div className="flex-1 h-px bg-[#1a1a1a]" />
                        </div>
                    )}

                    {/* Task cards */}
                    <div className="space-y-2">
                        {group.tasks.map((task) => {
                            const idx = globalIndex++;
                            return (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    variant="list"
                                    onToggleComplete={onToggleComplete}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    animationDelay={idx * 30}
                                />
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
