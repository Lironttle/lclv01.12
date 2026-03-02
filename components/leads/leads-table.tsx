'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    Mail,
    Phone,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LEAD_STATUS_CONFIG, LEAD_SOURCES } from '@/lib/constants';
import type { Lead, LeadStatus } from '@/lib/types';

// --- Helpers ---
function formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(val);
}

function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// --- Sort types ---
type SortField = 'name' | 'company' | 'status' | 'source' | 'value' | 'lastContact';
type SortDirection = 'asc' | 'desc';

const STATUS_ORDER: LeadStatus[] = [
    'new',
    'contacted',
    'qualified',
    'proposal',
    'negotiation',
    'won',
    'lost',
];

const ITEMS_PER_PAGE = 8;

// --- Component ---
interface LeadsTableProps {
    leads: Lead[];
    onEditLead?: (lead: Lead) => void;
}

export function LeadsTable({ leads, onEditLead }: LeadsTableProps) {
    const [sortField, setSortField] = useState<SortField>('lastContact');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    // Handle sort toggle
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Sort leads
    const sortedLeads = useMemo(() => {
        const sorted = [...leads].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'company':
                    comparison = a.company.localeCompare(b.company);
                    break;
                case 'status':
                    comparison = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
                    break;
                case 'source':
                    comparison = a.source.localeCompare(b.source);
                    break;
                case 'value':
                    comparison = a.value - b.value;
                    break;
                case 'lastContact':
                    comparison = a.lastContact.getTime() - b.lastContact.getTime();
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });
        return sorted;
    }, [leads, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sortedLeads.length / ITEMS_PER_PAGE));
    const paginatedLeads = sortedLeads.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page when leads change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [leads.length]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-3.5 h-3.5 text-[#555]" />;
        }
        return sortDirection === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-[#b91c1c]" />
        ) : (
            <ArrowDown className="w-3.5 h-3.5 text-[#b91c1c]" />
        );
    };

    if (leads.length === 0) {
        return (
            <div className="rounded-xl bg-[#111] border border-[#222] p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-[#555]" />
                </div>
                <p className="text-[#666] text-sm">No leads match your filters</p>
                <p className="text-[#444] text-xs">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Table */}
            <div className="rounded-xl bg-[#111] border border-[#222] overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#222] hover:bg-transparent">
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider">
                                <button
                                    onClick={() => handleSort('name')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Name
                                    <SortIcon field="name" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                                <button
                                    onClick={() => handleSort('company')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Company
                                    <SortIcon field="company" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider">
                                <button
                                    onClick={() => handleSort('status')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Status
                                    <SortIcon field="status" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">
                                <button
                                    onClick={() => handleSort('source')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Source
                                    <SortIcon field="source" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider text-right">
                                <button
                                    onClick={() => handleSort('value')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors ml-auto"
                                >
                                    Value
                                    <SortIcon field="value" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                                <button
                                    onClick={() => handleSort('lastContact')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Last Contact
                                    <SortIcon field="lastContact" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider w-[50px]">
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedLeads.map((lead, index) => {
                            const statusConfig = LEAD_STATUS_CONFIG[lead.status];
                            const sourceLabel =
                                LEAD_SOURCES[lead.source as keyof typeof LEAD_SOURCES] || lead.source;

                            return (
                                <TableRow
                                    key={lead.id}
                                    className={cn(
                                        'border-b border-[#1a1a1a] hover:bg-[#141414] transition-colors duration-200 cursor-pointer group',
                                        'animate-fade-in'
                                    )}
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        animationFillMode: 'backwards',
                                    }}
                                >
                                    {/* Name + Email */}
                                    <TableCell className="py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-medium text-white text-sm group-hover:text-[#dc2626] transition-colors duration-200">
                                                {lead.name}
                                            </span>
                                            <span className="text-xs text-[#666] flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {lead.email}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Company */}
                                    <TableCell className="py-3 text-sm text-[#a3a3a3] hidden md:table-cell">
                                        {lead.company}
                                    </TableCell>

                                    {/* Status Badge */}
                                    <TableCell className="py-3">
                                        <span
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: statusConfig.bgColor,
                                                color: statusConfig.color,
                                            }}
                                        >
                                            <span
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: statusConfig.color }}
                                            />
                                            {statusConfig.label}
                                        </span>
                                    </TableCell>

                                    {/* Source */}
                                    <TableCell className="py-3 text-sm text-[#a3a3a3] hidden lg:table-cell">
                                        {sourceLabel}
                                    </TableCell>

                                    {/* Value */}
                                    <TableCell className="py-3 text-right">
                                        <span className="font-mono text-sm text-white font-medium">
                                            {formatCurrency(lead.value)}
                                        </span>
                                    </TableCell>

                                    {/* Last Contact */}
                                    <TableCell className="py-3 text-sm text-[#a3a3a3] hidden sm:table-cell">
                                        {formatDate(lead.lastContact)}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-[#666] hover:text-white hover:bg-[#222] opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                    aria-label={`Actions for ${lead.name}`}
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-[#111] border-[#222] min-w-[160px]"
                                            >
                                                <DropdownMenuItem
                                                    className="text-sm text-[#a3a3a3] hover:text-white focus:text-white focus:bg-[#1a1a1a] cursor-pointer"
                                                    onClick={() => onEditLead?.(lead)}
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5 mr-2" />
                                                    Edit Lead
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm text-[#a3a3a3] hover:text-white focus:text-white focus:bg-[#1a1a1a] cursor-pointer">
                                                    <Mail className="w-3.5 h-3.5 mr-2" />
                                                    Send Email
                                                </DropdownMenuItem>
                                                {lead.phone && (
                                                    <DropdownMenuItem className="text-sm text-[#a3a3a3] hover:text-white focus:text-white focus:bg-[#1a1a1a] cursor-pointer">
                                                        <Phone className="w-3.5 h-3.5 mr-2" />
                                                        Call
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator className="bg-[#222]" />
                                                <DropdownMenuItem className="text-sm text-[#EF4444] hover:text-[#EF4444] focus:text-[#EF4444] focus:bg-[#EF4444]/10 cursor-pointer">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-[#666] font-mono">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            id="lead-page-prev"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0 text-[#666] hover:text-white hover:bg-[#222] disabled:opacity-30"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                    'h-8 w-8 p-0 text-xs font-mono transition-all duration-200',
                                    page === currentPage
                                        ? 'bg-[#730404] text-white hover:bg-[#8b1a1a]'
                                        : 'text-[#666] hover:text-white hover:bg-[#222]'
                                )}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            id="lead-page-next"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0 text-[#666] hover:text-white hover:bg-[#222] disabled:opacity-30"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
