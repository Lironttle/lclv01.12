'use client';

import React, { useState, useCallback } from 'react';
import { TaskCard } from './task-card';
import { TASK_STATUS_CONFIG } from '@/lib/constants';
import type { Task, TaskStatus } from '@/lib/types';
import { Plus, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
const BOARD_COLUMNS: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

interface TaskBoardProps {
    tasks: Task[];
    onToggleComplete?: (task: Task) => void;
    onEdit?: (task: Task) => void;
    onDelete?: (task: Task) => void;
    onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
    onAddTask?: () => void;
}

export function TaskBoard({
    tasks,
    onToggleComplete,
    onEdit,
    onDelete,
    onStatusChange,
    onAddTask,
}: TaskBoardProps) {
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

    // Group tasks by column
    const columns = BOARD_COLUMNS.map((status) => ({
        status,
        config: TASK_STATUS_CONFIG[status],
        tasks: tasks.filter((t) => t.status === status),
    }));

    // --- Drag handlers ---
    const handleDragStart = useCallback(
        (e: React.DragEvent<HTMLDivElement>, task: Task) => {
            setDraggedTask(task);
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', task.id);
            // Make the drag image slightly transparent
            if (e.currentTarget) {
                e.currentTarget.style.opacity = '0.5';
            }
        },
        []
    );

    const handleDragEnd = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.currentTarget.style.opacity = '1';
            setDraggedTask(null);
            setDragOverColumn(null);
        },
        []
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDragOverColumn(status);
        },
        []
    );

    const handleDragLeave = useCallback(() => {
        setDragOverColumn(null);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
            e.preventDefault();
            setDragOverColumn(null);

            if (draggedTask && draggedTask.status !== targetStatus) {
                onStatusChange?.(draggedTask.id, targetStatus);
            }
            setDraggedTask(null);
        },
        [draggedTask, onStatusChange]
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
                <div
                    key={column.status}
                    className={cn(
                        'flex flex-col rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden transition-all duration-200',
                        dragOverColumn === column.status && draggedTask?.status !== column.status
                            ? 'border-[#730404] bg-[#730404]/5 shadow-lg shadow-[#730404]/10'
                            : 'hover:border-[#222]'
                    )}
                    onDragOver={(e) => handleDragOver(e, column.status)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.status)}
                >
                    {/* Column header */}
                    <div className="flex items-center justify-between px-3 py-3 border-b border-[#1a1a1a]">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: column.config.color }}
                            />
                            <span className="text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider">
                                {column.config.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-[#555] font-mono bg-[#141414] px-1.5 py-0.5 rounded">
                                {column.tasks.length}
                            </span>
                            {column.status === 'todo' && onAddTask && (
                                <button
                                    onClick={onAddTask}
                                    className="w-6 h-6 rounded flex items-center justify-center text-[#555] hover:text-white hover:bg-[#222] transition-colors"
                                    aria-label="Add task"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Column body */}
                    <div className="flex-1 p-2 space-y-2 min-h-[200px] overflow-y-auto max-h-[calc(100vh-320px)]">
                        {column.tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 gap-2">
                                <Inbox className="w-5 h-5 text-[#333]" />
                                <p className="text-[10px] text-[#444] uppercase tracking-wider">
                                    {dragOverColumn === column.status
                                        ? 'Drop here'
                                        : 'No tasks'}
                                </p>
                            </div>
                        ) : (
                            column.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task)}
                                    onDragEnd={handleDragEnd}
                                    className={cn(
                                        'transition-transform duration-200',
                                        draggedTask?.id === task.id && 'scale-95 opacity-50'
                                    )}
                                >
                                    <TaskCard
                                        task={task}
                                        variant="board"
                                        onToggleComplete={onToggleComplete}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        isDragging={draggedTask?.id === task.id}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
