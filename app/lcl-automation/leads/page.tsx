'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Users, DollarSign, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeadFilters } from '@/components/leads/lead-filters';
import { LeadsTable } from '@/components/leads/leads-table';
import { AddLeadDialog } from '@/components/leads/add-lead-dialog';
import { mockLeads } from '@/lib/mock-data';
import { LEAD_STATUS_CONFIG } from '@/lib/constants';
import type { Lead, LeadStatus, LeadSource } from '@/lib/types';

// --- Quick stats helpers ---
function formatCurrency(val: number): string {
    if (val >= 1000) {
        return `$${(val / 1000).toFixed(1)}K`;
    }
    return `$${val}`;
}

export default function LeadsPage() {
    // Leads state (local mock data)
    const [leads, setLeads] = useState<Lead[]>(mockLeads);

    // Filter / search state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
    const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);

    // --- Derived data ---
    const filteredLeads = useMemo(() => {
        let result = leads;

        // Text search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (l) =>
                    l.name.toLowerCase().includes(q) ||
                    l.company.toLowerCase().includes(q) ||
                    l.email.toLowerCase().includes(q)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter((l) => l.status === statusFilter);
        }

        // Source filter
        if (sourceFilter !== 'all') {
            result = result.filter((l) => l.source === sourceFilter);
        }

        return result;
    }, [leads, searchQuery, statusFilter, sourceFilter]);

    // Quick stats from all leads
    const stats = useMemo(() => {
        const totalValue = leads.reduce((sum, l) => sum + l.value, 0);
        const qualifiedCount = leads.filter(
            (l) =>
                l.status === 'qualified' ||
                l.status === 'proposal' ||
                l.status === 'negotiation'
        ).length;
        const wonCount = leads.filter((l) => l.status === 'won').length;
        const conversionRate =
            leads.length > 0 ? ((wonCount / leads.length) * 100).toFixed(1) : '0';

        return { totalValue, qualifiedCount, wonCount, conversionRate };
    }, [leads]);

    // --- Handlers ---
    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setStatusFilter('all');
        setSourceFilter('all');
    }, []);

    const handleAddLead = useCallback(() => {
        setEditingLead(null);
        setDialogOpen(true);
    }, []);

    const handleEditLead = useCallback((lead: Lead) => {
        setEditingLead(lead);
        setDialogOpen(true);
    }, []);

    const handleSaveLead = useCallback(
        (data: Omit<Lead, 'id' | 'createdAt'>) => {
            if (editingLead) {
                // Update existing
                setLeads((prev) =>
                    prev.map((l) =>
                        l.id === editingLead.id
                            ? { ...l, ...data }
                            : l
                    )
                );
            } else {
                // Add new
                const newLead: Lead = {
                    ...data,
                    id: `l${Date.now()}`,
                    createdAt: new Date(),
                };
                setLeads((prev) => [newLead, ...prev]);
            }
        },
        [editingLead]
    );

    return (
        <div className="animate-fade-in space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Leads</h1>
                    <p className="text-sm text-[#666] mt-1">
                        Manage and track your sales pipeline
                    </p>
                </div>
                <Button
                    id="add-lead-btn"
                    onClick={handleAddLead}
                    className="bg-[#730404] text-white hover:bg-[#8b1a1a] transition-all duration-200 shadow-lg shadow-[#730404]/20 hover:shadow-[#730404]/30 h-10 px-5"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                </Button>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    {
                        label: 'Total Leads',
                        value: leads.length.toString(),
                        icon: Users,
                        color: '#3B82F6',
                    },
                    {
                        label: 'Pipeline Value',
                        value: formatCurrency(stats.totalValue),
                        icon: DollarSign,
                        color: '#22C55E',
                    },
                    {
                        label: 'Qualified',
                        value: stats.qualifiedCount.toString(),
                        icon: Target,
                        color: '#F59E0B',
                    },
                    {
                        label: 'Conversion',
                        value: `${stats.conversionRate}%`,
                        icon: TrendingUp,
                        color: '#8B5CF6',
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
                {(Object.entries(LEAD_STATUS_CONFIG) as [LeadStatus, typeof LEAD_STATUS_CONFIG[keyof typeof LEAD_STATUS_CONFIG]][]).map(
                    ([key, config]) => {
                        const count = leads.filter((l) => l.status === key).length;
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
                                        ? config.bgColor
                                        : 'transparent',
                                    borderColor: isActive
                                        ? config.color
                                        : '#222',
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
                    }
                )}
            </div>

            {/* Filters */}
            <div
                className="animate-fade-in"
                style={{ animationDelay: '250ms', animationFillMode: 'backwards' }}
            >
                <LeadFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    sourceFilter={sourceFilter}
                    onSourceChange={setSourceFilter}
                    onClearFilters={handleClearFilters}
                    totalCount={leads.length}
                    filteredCount={filteredLeads.length}
                />
            </div>

            {/* Data Table */}
            <div
                className="animate-fade-in"
                style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
            >
                <LeadsTable
                    leads={filteredLeads}
                    onEditLead={handleEditLead}
                />
            </div>

            {/* Add/Edit Dialog */}
            <AddLeadDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingLead={editingLead}
                onSave={handleSaveLead}
            />
        </div>
    );
}
