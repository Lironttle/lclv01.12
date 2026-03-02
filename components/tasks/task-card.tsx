'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
    Calendar,
    Clock,
    GripVertical,
    MoreHorizontal,
    Pencil,
    Trash2,
    CheckCircle2,
    Circle,
    AlertTriangle,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TASK_PRIORITY_CONFIG, TASK_CATEGORY_CONFIG } from '@/lib/constants';
import type { Task } from '@/lib/types';

// --- Helpers ---
function formatDueDate(date: Date): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / 86400000);

    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `${days}d left`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(task: Task): boolean {
    return task.status !== 'done' && new Date(task.dueDate) < new Date();
}

function isDueToday(task: Task): boolean {
    const today = new Date();
    const due = new Date(task.dueDate);
    return (
        task.status !== 'done' &&
        due.getDate() === today.getDate() &&
        due.getMonth() === today.getMonth() &&
        due.getFullYear() === today.getFullYear()
    );
}

// --- Component ---
interface TaskCardProps {
    task: Task;
    variant?: 'list' | 'board';
    onToggleComplete?: (task: Task) => void;
    onEdit?: (task: Task) => void;
    onDelete?: (task: Task) => void;
    isDragging?: boolean;
    dragHandleProps?: Record<string, unknown>;
    style?: React.CSSProperties;
    animationDelay?: number;
}

export const TaskCard = React.memo(function TaskCard({
    task,
    variant = 'list',
    onToggleComplete,
    onEdit,
    onDelete,
    isDragging = false,
    dragHandleProps,
    style,
    animationDelay = 0,
}: TaskCardProps) {
    const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
    const categoryConfig = TASK_CATEGORY_CONFIG[task.category];
    const overdue = isOverdue(task);
    const dueToday = isDueToday(task);
    const isDone = task.status === 'done';

    if (variant === 'board') {
        return (
            <div
                className={cn(
                    'rounded-lg bg-[#0a0a0a] border border-[#1a1a1a] p-3 space-y-2.5',
                    'hover:border-[#333] hover:bg-[#111] transition-all duration-200 cursor-pointer group',
                    isDragging && 'opacity-80 shadow-xl shadow-black/40 rotate-[2deg] scale-105 border-[#730404]/50',
                    isDone && 'opacity-60'
                )}
                style={style}
            >
                {/* Top: Priority + Actions */}
                <div className="flex items-center justify-between gap-2">
                    <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                            backgroundColor: priorityConfig.bgColor,
                            color: priorityConfig.color,
                        }}
                    >
                        {task.priority === 'urgent' && (
                            <AlertTriangle className="w-2.5 h-2.5" />
                        )}
                        {priorityConfig.label}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-[#555] hover:text-white hover:bg-[#222] opacity-0 group-hover:opacity-100 transition-all"
                                aria-label={`Actions for task ${task.title}`}
                            >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#111] border-[#222] min-w-[140px]">
                            <DropdownMenuItem
                                className="text-sm text-[#a3a3a3] hover:text-white focus:text-white focus:bg-[#1a1a1a] cursor-pointer"
                                onClick={() => onEdit?.(task)}
                            >
                                <Pencil className="w-3.5 h-3.5 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-sm text-[#a3a3a3] hover:text-white focus:text-white focus:bg-[#1a1a1a] cursor-pointer"
                                onClick={() => onToggleComplete?.(task)}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                {isDone ? 'Reopen' : 'Complete'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#222]" />
                            <DropdownMenuItem
                                className="text-sm text-[#EF4444] hover:text-[#EF4444] focus:text-[#EF4444] focus:bg-[#EF4444]/10 cursor-pointer"
                                onClick={() => onDelete?.(task)}
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Title */}
                <p className={cn(
                    'text-sm font-medium text-white leading-snug',
                    isDone && 'line-through text-[#666]'
                )}>
                    {task.title}
                </p>

                {/* Category pill */}
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{
                        backgroundColor: categoryConfig.bgColor,
                        color: categoryConfig.color,
                    }}
                >
                    {categoryConfig.label}
                </span>

                {/* Bottom: Due + Assignee */}
                <div className="flex items-center justify-between pt-1 border-t border-[#1a1a1a]">
                    <span
                        className={cn(
                            'flex items-center gap-1 text-[11px] font-mono',
                            overdue ? 'text-[#EF4444]' : dueToday ? 'text-[#F59E0B]' : 'text-[#666]'
                        )}
                    >
                        {overdue ? (
                            <AlertTriangle className="w-3 h-3" />
                        ) : (
                            <Calendar className="w-3 h-3" />
                        )}
                        {formatDueDate(task.dueDate)}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-[#555]">
                        <User className="w-3 h-3" />
                        <span>{task.assignee}</span>
                    </div>
                </div>
            </div>
        );
    }

    // --- List variant ---
    return (
        <div
            className={cn(
                'rounded-lg bg-[#111] border border-[#222] p-3 sm:p-4',
                'hover:border-[#333] hover:bg-[#141414] transition-all duration-200 group',
                isDragging && 'opacity-80 shadow-xl shadow-black/40',
                isDone && 'opacity-60',
                'animate-fade-in'
            )}
            style={{
                animationDelay: `${animationDelay}ms`,
                animationFillMode: 'backwards',
                ...style,
            }}
        >
            <div className="flex items-start gap-3">
                {/* Drag handle */}
                {dragHandleProps && (
                    <div
                        {...dragHandleProps}
                        className="pt-0.5 text-[#333] hover:text-[#666] cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical className="w-4 h-4" />
                    </div>
                )}

                {/* Checkbox */}
                <button
                    onClick={() => onToggleComplete?.(task)}
                    className="pt-0.5 shrink-0 transition-colors duration-200"
                    aria-label={isDone ? 'Reopen task' : 'Complete task'}
                >
                    {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                    ) : (
                        <Circle className="w-5 h-5 text-[#444] hover:text-[#22C55E] transition-colors" />
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-2">
                        <p
                            className={cn(
                                'text-sm font-medium text-white',
                                isDone && 'line-through text-[#666]'
                            )}
                        >
                            {task.title}
                        </p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-[#555] hover:text-white hover:bg-[#222] opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                    aria-label={`Actions for task ${task.title}`}
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#111] border-[#222] min-w-[140px]">
                                <DropdownMenuItem
                                    className="text-sm text-[#a3a3a3] hover:text-white focus:text-white focus:bg-[#1a1a1a] cursor-pointer"
                                    onClick={() => onEdit?.(task)}
                                >
                                    <Pencil className="w-3.5 h-3.5 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#222]" />
                                <DropdownMenuItem
                                    className="text-sm text-[#EF4444] hover:text-[#EF4444] focus:text-[#EF4444] focus:bg-[#EF4444]/10 cursor-pointer"
                                    onClick={() => onDelete?.(task)}
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Description preview */}
                    {task.description && !isDone && (
                        <p className="text-xs text-[#555] line-clamp-1">{task.description}</p>
                    )}

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Priority badge */}
                        <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                            style={{
                                backgroundColor: priorityConfig.bgColor,
                                color: priorityConfig.color,
                            }}
                        >
                            {task.priority === 'urgent' && (
                                <AlertTriangle className="w-2.5 h-2.5" />
                            )}
                            {priorityConfig.label}
                        </span>

                        {/* Category */}
                        <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium"
                            style={{
                                backgroundColor: categoryConfig.bgColor,
                                color: categoryConfig.color,
                            }}
                        >
                            {categoryConfig.label}
                        </span>

                        {/* Due date */}
                        <span
                            className={cn(
                                'flex items-center gap-1 text-[11px] font-mono',
                                overdue
                                    ? 'text-[#EF4444]'
                                    : dueToday
                                        ? 'text-[#F59E0B]'
                                        : 'text-[#555]'
                            )}
                        >
                            {overdue ? (
                                <Clock className="w-3 h-3" />
                            ) : (
                                <Calendar className="w-3 h-3" />
                            )}
                            {formatDueDate(task.dueDate)}
                        </span>

                        {/* Assignee */}
                        <span className="flex items-center gap-1 text-[11px] text-[#444] ml-auto">
                            <User className="w-3 h-3" />
                            {task.assignee}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});
