'use client';

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LEAD_STATUS_CONFIG, LEAD_SOURCES } from '@/lib/constants';
import type { LeadStatus, LeadSource } from '@/lib/types';

interface LeadFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: LeadStatus | 'all';
    onStatusChange: (status: LeadStatus | 'all') => void;
    sourceFilter: LeadSource | 'all';
    onSourceChange: (source: LeadSource | 'all') => void;
    onClearFilters: () => void;
    totalCount: number;
    filteredCount: number;
}

export function LeadFilters({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sourceFilter,
    onSourceChange,
    onClearFilters,
    totalCount,
    filteredCount,
}: LeadFiltersProps) {
    const hasActiveFilters =
        searchQuery !== '' || statusFilter !== 'all' || sourceFilter !== 'all';

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-4">
            <div className="flex flex-col gap-4">
                {/* Top row: Search + Filter indicator */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[#a3a3a3]">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">Filters</span>
                    </div>
                    <div className="h-4 w-px bg-[#333] hidden sm:block" />
                    <span className="text-xs text-[#666] font-mono hidden sm:inline">
                        {filteredCount === totalCount
                            ? `${totalCount} leads`
                            : `${filteredCount} of ${totalCount} leads`}
                    </span>
                </div>

                {/* Filter controls row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search input */}
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                        <Input
                            id="lead-search"
                            placeholder="Search leads by name, company, or email..."
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

                    {/* Status filter */}
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => onStatusChange(val as LeadStatus | 'all')}
                    >
                        <SelectTrigger
                            id="lead-status-filter"
                            className="w-full sm:w-[160px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]"
                        >
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Statuses</SelectItem>
                            {(Object.entries(LEAD_STATUS_CONFIG) as [LeadStatus, typeof LEAD_STATUS_CONFIG[keyof typeof LEAD_STATUS_CONFIG]][]).map(
                                ([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: config.color }}
                                            />
                                            {config.label}
                                        </span>
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    {/* Source filter */}
                    <Select
                        value={sourceFilter}
                        onValueChange={(val) => onSourceChange(val as LeadSource | 'all')}
                    >
                        <SelectTrigger
                            id="lead-source-filter"
                            className="w-full sm:w-[160px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]"
                        >
                            <SelectValue placeholder="All Sources" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Sources</SelectItem>
                            {(Object.entries(LEAD_SOURCES) as [LeadSource, string][]).map(
                                ([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <Button
                            id="lead-clear-filters"
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
