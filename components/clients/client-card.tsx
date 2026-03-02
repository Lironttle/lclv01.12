'use client';

import React from 'react';
import {
    Building2,
    UserCircle2,
    Mail,
    Phone,
    Calendar,
    DollarSign,
    FileText,
    ArrowRight,
    Briefcase,
} from 'lucide-react';
import type { Client, Contact } from '@/lib/types';
import { CLIENT_STATUS_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/button';

interface ClientCardProps {
    client: Client | null;
    contact?: Contact | null;
    onEditClient?: (client: Client) => void;
    onAddProject?: (client: Client) => void;
    onCreateInvoice?: (client: Client) => void;
}

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

export function ClientCard({
    client,
    contact,
    onEditClient,
    onAddProject,
    onCreateInvoice,
}: ClientCardProps) {
    if (!client) {
        return (
            <div className="rounded-xl bg-[#111] border border-dashed border-[#222] p-6 flex items-center justify-center text-sm text-[#666]">
                Select a client from the table to view details
            </div>
        );
    }

    const statusConfig = CLIENT_STATUS_CONFIG[client.status];

    return (
        <div className="rounded-xl bg-[#111] border border-[#222] p-5 lg:p-6 flex flex-col gap-4 lg:gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[#a3a3a3]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white leading-tight">
                            {client.companyName}
                        </h2>
                        <p className="text-xs text-[#666]">
                            {client.billingCycle.charAt(0).toUpperCase() +
                                client.billingCycle.slice(1)}{' '}
                            billing
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-[#333] text-[#a3a3a3] hover:bg-[#222] hover:text-white h-8 px-3 text-xs"
                        onClick={() => onEditClient?.(client)}
                    >
                        Edit
                    </Button>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {/* Primary contact */}
                <div className="space-y-3 md:col-span-1">
                    <h3 className="text-xs font-semibold text-[#777] uppercase tracking-wider">
                        Primary Contact
                    </h3>
                    {contact ? (
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-[#a3a3a3]">
                                <UserCircle2 className="w-4 h-4 text-[#666]" />
                                <span className="text-white">{contact.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#a3a3a3]">
                                <Mail className="w-4 h-4 text-[#666]" />
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="hover:text-white hover:underline underline-offset-2"
                                >
                                    {contact.email}
                                </a>
                            </div>
                            {contact.phone && (
                                <div className="flex items-center gap-2 text-[#a3a3a3]">
                                    <Phone className="w-4 h-4 text-[#666]" />
                                    <span>{contact.phone}</span>
                                </div>
                            )}
                            <p className="text-xs text-[#666]">
                                {contact.role} @ {contact.company}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs text-[#555]">
                            No primary contact linked to this client.
                        </p>
                    )}
                </div>

                {/* Financials */}
                <div className="space-y-3 md:col-span-1">
                    <h3 className="text-xs font-semibold text-[#777] uppercase tracking-wider">
                        Financials
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-[#0b0b0b] border border-[#262626] p-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] text-[#666] uppercase tracking-wider">
                                    Contract Value
                                </span>
                                <DollarSign className="w-3.5 h-3.5 text-[#22C55E]" />
                            </div>
                            <p className="text-lg font-mono font-semibold text-white mt-1">
                                {formatCurrency(client.contractValue)}
                            </p>
                        </div>
                        <div className="rounded-lg bg-[#0b0b0b] border border-[#262626] p-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] text-[#666] uppercase tracking-wider">
                                    MRR
                                </span>
                                <DollarSign className="w-3.5 h-3.5 text-[#22C55E]" />
                            </div>
                            <p className="text-lg font-mono font-semibold text-white mt-1">
                                {formatCurrency(client.mrr)}
                                <span className="text-xs text-[#666] ml-1">/mo</span>
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2 text-xs text-[#a3a3a3]">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#666]" />
                            <span>
                                Start:{' '}
                                <span className="text-white">
                                    {formatDate(client.startDate)}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#666]" />
                            <span>
                                Next invoice:{' '}
                                <span className="text-white">
                                    {formatDate(client.nextInvoiceDate)}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Projects & actions */}
                <div className="space-y-3 md:col-span-1">
                    <h3 className="text-xs font-semibold text-[#777] uppercase tracking-wider">
                        Projects & Actions
                    </h3>
                    <div className="space-y-2 text-sm">
                        {client.projects.length > 0 ? (
                            <ul className="space-y-1.5">
                                {client.projects.map((project) => (
                                    <li
                                        key={project}
                                        className="flex items-center gap-2 text-[#a3a3a3]"
                                    >
                                        <Briefcase className="w-3.5 h-3.5 text-[#666]" />
                                        <span>{project}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-[#555]">
                                No projects added yet for this client.
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                            size="sm"
                            className="bg-[#730404] text-white hover:bg-[#8b1a1a] h-8 px-3 text-xs"
                            onClick={() => onAddProject?.(client)}
                        >
                            <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                            Add Project
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-[#333] text-[#a3a3a3] hover:bg-[#222] hover:text-white h-8 px-3 text-xs"
                            onClick={() => onCreateInvoice?.(client)}
                        >
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            Create Invoice
                        </Button>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="pt-3 border-t border-[#1a1a1a]">
                <p className="text-xs font-semibold text-[#777] uppercase tracking-wider mb-1.5">
                    Notes
                </p>
                <p className="text-sm text-[#a3a3a3] leading-relaxed">
                    {client.notes || 'No notes yet.'}
                </p>
            </div>
        </div>
    );
}

