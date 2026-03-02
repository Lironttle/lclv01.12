'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
    Plus,
    CheckSquare,
    Clock,
    AlertTriangle,
    ListChecks,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskFilters } from '@/components/tasks/task-filters';
import { TaskList } from '@/components/tasks/task-list';
import { TaskBoard } from '@/components/tasks/task-board';
import { AddTaskDialog } from '@/components/tasks/add-task-dialog';
import { mockTasks } from '@/lib/mock-data';
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '@/lib/constants';
import type { Task, TaskPriority, TaskStatus, TaskCategory } from '@/lib/types';

type ViewMode = 'list' | 'board';

export default function TasksPage() {
    // Tasks state
    const [tasks, setTasks] = useState<Task[]>(mockTasks);

    // Filter / search state
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');

    // View mode state
    const [viewMode, setViewMode] = useState<ViewMode>('list');

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // --- Derived data ---
    const filteredTasks = useMemo(() => {
        let result = tasks;

        // Text search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.title.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.assignee.toLowerCase().includes(q)
            );
        }

        // Priority filter
        if (priorityFilter !== 'all') {
            result = result.filter((t) => t.priority === priorityFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter((t) => t.status === statusFilter);
        }

        // Category filter
        if (categoryFilter !== 'all') {
            result = result.filter((t) => t.category === categoryFilter);
        }

        return result;
    }, [tasks, searchQuery, priorityFilter, statusFilter, categoryFilter]);

    // Quick stats from all tasks
    const stats = useMemo(() => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === 'done').length;
        const overdueTasks = tasks.filter(
            (t) => t.status !== 'done' && new Date(t.dueDate) < new Date()
        ).length;
        const urgentTasks = tasks.filter(
            (t) => t.status !== 'done' && t.priority === 'urgent'
        ).length;

        return { totalTasks, completedTasks, overdueTasks, urgentTasks };
    }, [tasks]);

    // --- Handlers ---
    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setPriorityFilter('all');
        setStatusFilter('all');
        setCategoryFilter('all');
    }, []);

    const handleAddTask = useCallback(() => {
        setEditingTask(null);
        setDialogOpen(true);
    }, []);

    const handleEditTask = useCallback((task: Task) => {
        setEditingTask(task);
        setDialogOpen(true);
    }, []);

    const handleSaveTask = useCallback(
        (data: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => {
            if (editingTask) {
                setTasks((prev) =>
                    prev.map((t) =>
                        t.id === editingTask.id ? { ...t, ...data } : t
                    )
                );
            } else {
                const newTask: Task = {
                    ...data,
                    id: `t${Date.now()}`,
                    createdAt: new Date(),
                };
                setTasks((prev) => [newTask, ...prev]);
            }
        },
        [editingTask]
    );

    const handleToggleComplete = useCallback((task: Task) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === task.id
                    ? {
                        ...t,
                        status: t.status === 'done' ? 'todo' : ('done' as TaskStatus),
                        completedAt: t.status === 'done' ? undefined : new Date(),
                    }
                    : t
            )
        );
    }, []);

    const handleDeleteTask = useCallback((task: Task) => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
    }, []);

    const handleStatusChange = useCallback((taskId: string, newStatus: TaskStatus) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === taskId
                    ? {
                        ...t,
                        status: newStatus,
                        completedAt: newStatus === 'done' ? new Date() : undefined,
                    }
                    : t
            )
        );
    }, []);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Tasks</h1>
                    <p className="text-sm text-[#666] mt-1">
                        Manage and track your work with list or board view
                    </p>
                </div>
                <Button
                    id="add-task-btn"
                    onClick={handleAddTask}
                    className="bg-[#730404] text-white hover:bg-[#8b1a1a] transition-all duration-200 shadow-lg shadow-[#730404]/20 hover:shadow-[#730404]/30 h-10 px-5"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    {
                        label: 'Total Tasks',
                        value: stats.totalTasks.toString(),
                        icon: ListChecks,
                        color: '#3B82F6',
                    },
                    {
                        label: 'Completed',
                        value: stats.completedTasks.toString(),
                        icon: CheckSquare,
                        color: '#22C55E',
                    },
                    {
                        label: 'Overdue',
                        value: stats.overdueTasks.toString(),
                        icon: Clock,
                        color: '#EF4444',
                    },
                    {
                        label: 'Urgent',
                        value: stats.urgentTasks.toString(),
                        icon: AlertTriangle,
                        color: '#F59E0B',
                    },
                ].map((stat, i) => (
                    <div
                        key={stat.label}
                        className="rounded-xl bg-[#111] border border-[#222] p-4 flex items-center gap-3 hover:border-[#333] hover:bg-[#141414] transition-all duration-300 animate-fade-in"
                        style={{
                            animationDelay: `${i * 60}ms`,
                            animationFillMode: 'backwards',
                        }}
                    >
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${stat.color}15` }}
                        >
                            <stat.icon
                                className="w-4 h-4"
                                style={{ color: stat.color }}
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-[#666] uppercase tracking-wider truncate">
                                {stat.label}
                            </p>
                            <p className="text-lg font-bold font-mono text-white">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Distribution Chips */}
            <div
                className="flex flex-wrap gap-2 animate-fade-in"
                style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
            >
                {(
                    Object.entries(TASK_STATUS_CONFIG) as [
                        TaskStatus,
                        (typeof TASK_STATUS_CONFIG)[keyof typeof TASK_STATUS_CONFIG]
                    ][]
                ).map(([key, config]) => {
                    const count = tasks.filter((t) => t.status === key).length;
                    const isActive = statusFilter === key;
                    return (
                        <button
                            key={key}
                            onClick={() =>
                                setStatusFilter(isActive ? 'all' : key)
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
                            style={{
                                backgroundColor: isActive
                                    ? `${config.color}20`
                                    : 'transparent',
                                borderColor: isActive ? config.color : '#222',
                                color: isActive ? config.color : '#666',
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: config.color }}
                            />
                            {config.label}
                            <span
                                className="font-mono ml-0.5"
                                style={{
                                    color: isActive ? config.color : '#555',
                                }}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}

                {/* Priority chips */}
                <div className="h-4 w-px bg-[#222] mx-1 self-center" />
                {(
                    Object.entries(TASK_PRIORITY_CONFIG) as [
                        TaskPriority,
                        (typeof TASK_PRIORITY_CONFIG)[keyof typeof TASK_PRIORITY_CONFIG]
                    ][]
                ).map(([key, config]) => {
                    const count = tasks.filter((t) => t.priority === key).length;
                    const isActive = priorityFilter === key;
                    return (
                        <button
                            key={key}
                            onClick={() =>
                                setPriorityFilter(isActive ? 'all' : key)
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
                            style={{
                                backgroundColor: isActive
                                    ? `${config.color}20`
                                    : 'transparent',
                                borderColor: isActive ? config.color : '#222',
                                color: isActive ? config.color : '#666',
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: config.color }}
                            />
                            {config.label}
                            <span
                                className="font-mono ml-0.5"
                                style={{
                                    color: isActive ? config.color : '#555',
                                }}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Filters */}
            <div
                className="animate-fade-in"
                style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}
            >
                <TaskFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    priorityFilter={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    categoryFilter={categoryFilter}
                    onCategoryChange={setCategoryFilter}
                    onClearFilters={handleClearFilters}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    totalCount={tasks.length}
                    filteredCount={filteredTasks.length}
                />
            </div>

            {/* Task View */}
            <div
                className="animate-fade-in"
                style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
            >
                {viewMode === 'list' ? (
                    <TaskList
                        tasks={filteredTasks}
                        groupBy="status"
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                    />
                ) : (
                    <TaskBoard
                        tasks={filteredTasks}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        onAddTask={handleAddTask}
                    />
                )}
            </div>

            {/* Add/Edit Dialog */}
            <AddTaskDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingTask={editingTask}
                onSave={handleSaveTask}
            />
        </div>
    );
}
