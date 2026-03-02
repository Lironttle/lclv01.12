'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, LayoutList, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    TASK_PRIORITY_CONFIG,
    TASK_STATUS_CONFIG,
    TASK_CATEGORY_CONFIG,
} from '@/lib/constants';
import type { TaskPriority, TaskStatus, TaskCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'board';

interface TaskFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    priorityFilter: TaskPriority | 'all';
    onPriorityChange: (priority: TaskPriority | 'all') => void;
    statusFilter: TaskStatus | 'all';
    onStatusChange: (status: TaskStatus | 'all') => void;
    categoryFilter: TaskCategory | 'all';
    onCategoryChange: (category: TaskCategory | 'all') => void;
    onClearFilters: () => void;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
    totalCount: number;
    filteredCount: number;
}

export function TaskFilters({
    searchQuery,
    onSearchChange,
    priorityFilter,
    onPriorityChange,
    statusFilter,
    onStatusChange,
    categoryFilter,
    onCategoryChange,
    onClearFilters,
    viewMode,
    onViewModeChange,
    totalCount,
    filteredCount,
}: TaskFiltersProps) {
    const hasActiveFilters =
        searchQuery !== '' ||
        priorityFilter !== 'all' ||
        statusFilter !== 'all' ||
        categoryFilter !== 'all';

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-4">
            <div className="flex flex-col gap-4">
                {/* Top row: Filters label + View toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[#a3a3a3]">
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="text-sm font-medium hidden sm:inline">Filters</span>
                        </div>
                        <div className="h-4 w-px bg-[#333] hidden sm:block" />
                        <span className="text-xs text-[#666] font-mono hidden sm:inline">
                            {filteredCount === totalCount
                                ? `${totalCount} tasks`
                                : `${filteredCount} of ${totalCount} tasks`}
                        </span>
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 bg-[#0a0a0a] rounded-lg p-1 border border-[#222]">
                        <button
                            id="task-view-list"
                            onClick={() => onViewModeChange('list')}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                                viewMode === 'list'
                                    ? 'bg-[#730404] text-white shadow-sm'
                                    : 'text-[#666] hover:text-white'
                            )}
                            aria-label="List view"
                        >
                            <LayoutList className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">List</span>
                        </button>
                        <button
                            id="task-view-board"
                            onClick={() => onViewModeChange('board')}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                                viewMode === 'board'
                                    ? 'bg-[#730404] text-white shadow-sm'
                                    : 'text-[#666] hover:text-white'
                            )}
                            aria-label="Board view"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Board</span>
                        </button>
                    </div>
                </div>

                {/* Filter controls row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search input */}
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                        <Input
                            id="task-search"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#555] focus-visible:ring-[#730404] h-9 text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Priority filter */}
                    <Select
                        value={priorityFilter}
                        onValueChange={(val) => onPriorityChange(val as TaskPriority | 'all')}
                    >
                        <SelectTrigger
                            id="task-priority-filter"
                            className="w-full sm:w-[140px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]"
                        >
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Priorities</SelectItem>
                            {(
                                Object.entries(TASK_PRIORITY_CONFIG) as [
                                    TaskPriority,
                                    (typeof TASK_PRIORITY_CONFIG)[keyof typeof TASK_PRIORITY_CONFIG]
                                ][]
                            ).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    <span className="flex items-center gap-2">
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

                    {/* Status filter */}
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => onStatusChange(val as TaskStatus | 'all')}
                    >
                        <SelectTrigger
                            id="task-status-filter"
                            className="w-full sm:w-[140px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]"
                        >
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Statuses</SelectItem>
                            {(
                                Object.entries(TASK_STATUS_CONFIG) as [
                                    TaskStatus,
                                    (typeof TASK_STATUS_CONFIG)[keyof typeof TASK_STATUS_CONFIG]
                                ][]
                            ).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    <span className="flex items-center gap-2">
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

                    {/* Category filter */}
                    <Select
                        value={categoryFilter}
                        onValueChange={(val) => onCategoryChange(val as TaskCategory | 'all')}
                    >
                        <SelectTrigger
                            id="task-category-filter"
                            className="w-full sm:w-[150px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]"
                        >
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Categories</SelectItem>
                            {(
                                Object.entries(TASK_CATEGORY_CONFIG) as [
                                    TaskCategory,
                                    (typeof TASK_CATEGORY_CONFIG)[keyof typeof TASK_CATEGORY_CONFIG]
                                ][]
                            ).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    <span className="flex items-center gap-2">
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

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <Button
                            id="task-clear-filters"
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="text-[#a3a3a3] hover:text-white hover:bg-[#222] h-9 px-3 shrink-0"
                        >
                            <X className="w-3.5 h-3.5 mr-1.5" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
