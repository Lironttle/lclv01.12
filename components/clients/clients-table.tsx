'use client';

import React, { useMemo, useState } from 'react';
import { Building2, UserCircle2, DollarSign, Calendar, MoreHorizontal, BadgeInfo, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Client, Contact } from '@/lib/types';
import { CLIENT_STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortField = 'companyName' | 'status' | 'mrr' | 'startDate' | 'nextInvoiceDate';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

function formatCurrency(value: number): string {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

interface ClientsTableProps {
    clients: Client[];
    contactsById: Map<string, Contact>;
    onRowClick?: (client: Client) => void;
    onEditClient?: (client: Client) => void;
}

export function ClientsTable({
    clients,
    contactsById,
    onRowClick,
    onEditClient,
}: ClientsTableProps) {
    const [sortField, setSortField] = useState<SortField>('mrr');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    const sortedClients = useMemo(() => {
        const sorted = [...clients].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'companyName':
                    comparison = a.companyName.localeCompare(b.companyName);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'mrr':
                    comparison = a.mrr - b.mrr;
                    break;
                case 'startDate':
                    comparison = a.startDate.getTime() - b.startDate.getTime();
                    break;
                case 'nextInvoiceDate':
                    comparison = a.nextInvoiceDate.getTime() - b.nextInvoiceDate.getTime();
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return sorted;
    }, [clients, sortField, sortDirection]);

    const totalPages = Math.max(1, Math.ceil(sortedClients.length / ITEMS_PER_PAGE));
    const paginatedClients = sortedClients.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    React.useEffect(() => {
        setCurrentPage(1);
    }, [clients.length]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) {
            return (
                <span className="text-[#555] text-[10px] font-mono tracking-tight">
                    ↕
                </span>
            );
        }
        return (
            <span
                className="text-[10px] font-mono tracking-tight"
                style={{ color: '#b91c1c' }}
            >
                {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    if (clients.length === 0) {
        return (
            <div className="rounded-xl bg-[#111] border border-[#222] p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <BadgeInfo className="w-5 h-5 text-[#555]" />
                </div>
                <p className="text-[#666] text-sm">No clients found</p>
                <p className="text-[#444] text-xs">
                    Add a client to start tracking revenue
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="rounded-xl bg-[#111] border border-[#222] overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#222] hover:bg-transparent">
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider">
                                <button
                                    onClick={() => handleSort('companyName')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Company
                                    <SortIcon field="companyName" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">
                                Primary Contact
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
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                                <button
                                    onClick={() => handleSort('mrr')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    MRR
                                    <SortIcon field="mrr" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden xl:table-cell">
                                <button
                                    onClick={() => handleSort('startDate')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Start Date
                                    <SortIcon field="startDate" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden xl:table-cell">
                                <button
                                    onClick={() => handleSort('nextInvoiceDate')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Next Invoice
                                    <SortIcon field="nextInvoiceDate" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider w-[50px]">
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedClients.map((client, index) => {
                            const contact = contactsById.get(client.contactId);
                            const statusConfig = CLIENT_STATUS_CONFIG[client.status];

                            return (
                                <TableRow
                                    key={client.id}
                                    onClick={() => onRowClick?.(client)}
                                    className={cn(
                                        'border-b border-[#1a1a1a] hover:bg-[#141414] transition-colors duration-200 cursor-pointer group',
                                        'animate-fade-in',
                                    )}
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        animationFillMode: 'backwards',
                                    }}
                                >
                                    {/* Company */}
                                    <TableCell className="py-3">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                                                    <Building2 className="w-3.5 h-3.5 text-[#a3a3a3]" />
                                                </div>
                                                <span className="font-medium text-white text-sm group-hover:text-[#dc2626] transition-colors duration-200">
                                                    {client.companyName}
                                                </span>
                                            </div>
                                            <span className="text-xs text-[#666]">
                                                {client.projects.join(' • ') || 'No active projects'}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Primary contact */}
                                    <TableCell className="py-3 text-sm text-[#a3a3a3] hidden lg:table-cell">
                                        {contact ? (
                                            <div className="flex items-center gap-2">
                                                <UserCircle2 className="w-4 h-4 text-[#666]" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-white">
                                                        {contact.name}
                                                    </span>
                                                    <span className="text-xs text-[#666]">
                                                        {contact.email}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-[#555]">
                                                No linked contact
                                            </span>
                                        )}
                                    </TableCell>

                                    {/* Status */}
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

                                    {/* MRR */}
                                    <TableCell className="py-3 text-sm text-[#a3a3a3] hidden sm:table-cell">
                                        <div className="flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5 text-[#22C55E]" />
                                            <span className="font-mono text-white">
                                                {formatCurrency(client.mrr)}
                                            </span>
                                            <span className="text-xs text-[#555]">/mo</span>
                                        </div>
                                    </TableCell>

                                    {/* Start date */}
                                    <TableCell className="py-3 text-xs text-[#a3a3a3] hidden xl:table-cell">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-[#666]" />
                                            <span>{formatDate(client.startDate)}</span>
                                        </div>
                                    </TableCell>

                                    {/* Next invoice */}
                                    <TableCell className="py-3 text-xs text-[#a3a3a3] hidden xl:table-cell">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-[#666]" />
                                            <span>{formatDate(client.nextInvoiceDate)}</span>
                                        </div>
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-[#666] hover:text-white hover:bg-[#222] opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                    aria-label={`Actions for ${client.companyName}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-[#111] border-[#222] min-w-[170px]"
                                            >
                                                <DropdownMenuItem
                                                    className="text-sm text-[#a3a3a3] hover:text-white focus:text-white focus:bg-[#1a1a1a] cursor-pointer"
                                                    onClick={() => onEditClient?.(client)}
                                                >
                                                    Edit Client
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

            {totalPages > 1 && (
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-[#666] font-mono">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
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
                                        : 'text-[#666] hover:text-white hover:bg-[#222]',
                                )}
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
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

