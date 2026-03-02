'use client';

import React, { useMemo, useState } from 'react';
import { Mail, Building2, BadgeInfo, Tag, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Contact } from '@/lib/types';
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

type SortField = 'name' | 'company' | 'role' | 'lastInteraction' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export type LeadStatusMeta = {
    label: string;
    color: string;
    bgColor: string;
};

interface ContactsTableProps {
    contacts: Contact[];
    onRowClick?: (contact: Contact) => void;
    onEditContact?: (contact: Contact) => void;
    getLeadStatusMeta?: (contact: Contact) => LeadStatusMeta | null;
}

function formatRelativeDate(date?: Date): string {
    if (!date) return 'No activity';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ContactsTable({
    contacts,
    onRowClick,
    onEditContact,
    getLeadStatusMeta,
}: ContactsTableProps) {
    const [sortField, setSortField] = useState<SortField>('lastInteraction');
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

    const sortedContacts = useMemo(() => {
        const sorted = [...contacts].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'company':
                    comparison = a.company.localeCompare(b.company);
                    break;
                case 'role':
                    comparison = a.role.localeCompare(b.role);
                    break;
                case 'lastInteraction': {
                    const aTime = a.lastInteraction ? a.lastInteraction.getTime() : 0;
                    const bTime = b.lastInteraction ? b.lastInteraction.getTime() : 0;
                    comparison = aTime - bTime;
                    break;
                }
                case 'createdAt':
                    comparison = a.createdAt.getTime() - b.createdAt.getTime();
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return sorted;
    }, [contacts, sortField, sortDirection]);

    const totalPages = Math.max(1, Math.ceil(sortedContacts.length / ITEMS_PER_PAGE));
    const paginatedContacts = sortedContacts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    React.useEffect(() => {
        setCurrentPage(1);
    }, [contacts.length]);

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

    if (contacts.length === 0) {
        return (
            <div className="rounded-xl bg-[#111] border border-[#222] p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <BadgeInfo className="w-5 h-5 text-[#555]" />
                </div>
                <p className="text-[#666] text-sm">No contacts found</p>
+                <p className="text-[#444] text-xs">
+                    Try adjusting your search or filters
+                </p>
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
                                    onClick={() => handleSort('name')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Name
                                    <SortIcon field="name" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden lg:table-cell">
                                <button
                                    onClick={() => handleSort('company')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Company
                                    <SortIcon field="company" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden md:table-cell">
                                <button
                                    onClick={() => handleSort('role')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Role
                                    <SortIcon field="role" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider">
                                Lead Status
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden sm:table-cell">
                                <button
                                    onClick={() => handleSort('lastInteraction')}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                                >
                                    Last Interaction
                                    <SortIcon field="lastInteraction" />
                                </button>
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider hidden xl:table-cell">
                                Tags
                            </TableHead>
                            <TableHead className="text-[#a3a3a3] font-medium text-xs uppercase tracking-wider w-[50px]">
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedContacts.map((contact, index) => {
                            const leadStatus = getLeadStatusMeta?.(contact) ?? null;

                            return (
                                <TableRow
                                    key={contact.id}
                                    onClick={() => onRowClick?.(contact)}
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
                                                {contact.name}
                                            </span>
                                            <span className="text-xs text-[#666] flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {contact.email}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Company */}
                                    <TableCell className="py-3 text-sm text-[#a3a3a3] hidden lg:table-cell">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-[#555]" />
                                            <span>{contact.company}</span>
                                        </div>
                                    </TableCell>

                                    {/* Role */}
                                    <TableCell className="py-3 text-sm text-[#a3a3a3] hidden md:table-cell">
                                        {contact.role}
                                    </TableCell>

                                    {/* Lead Status */}
                                    <TableCell className="py-3">
                                        {leadStatus ? (
                                            <span
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: leadStatus.bgColor,
                                                    color: leadStatus.color,
                                                }}
                                            >
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ backgroundColor: leadStatus.color }}
                                                />
                                                {leadStatus.label}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-[#555]">No linked lead</span>
                                        )}
                                    </TableCell>

                                    {/* Last Interaction */}
                                    <TableCell className="py-3 text-sm text-[#a3a3a3] hidden sm:table-cell">
                                        {formatRelativeDate(contact.lastInteraction)}
                                    </TableCell>

                                    {/* Tags */}
                                    <TableCell className="py-3 hidden xl:table-cell">
                                        <div className="flex flex-wrap gap-1.5">
                                            {contact.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border border-[#333] text-[#a3a3a3] bg-[#0a0a0a]"
                                                >
                                                    <Tag className="w-3 h-3 text-[#555]" />
                                                    {tag}
                                                </span>
                                            ))}
                                            {contact.tags.length > 3 && (
                                                <span className="text-[11px] text-[#555]">
                                                    +{contact.tags.length - 3} more
                                                </span>
                                            )}
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
                                                    aria-label={`Actions for ${contact.name}`}
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
                                                    onClick={() => onEditContact?.(contact)}
                                                >
                                                    Edit Contact
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-sm text-[#a3a3a3] hover:text-white focus:text-white focus:bg-[#1a1a1a] cursor-pointer">
                                                    View Details
                                                </DropdownMenuItem>
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
                                        : 'text-[#666] hover:text-white hover:bg-[#222]'
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

