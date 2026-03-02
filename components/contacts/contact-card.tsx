'use client';

import React from 'react';
import {
    Mail,
    Phone,
    Building2,
    Link2,
    UserCircle2,
    Tag,
    MessageSquare,
    ArrowRight,
} from 'lucide-react';
import type { Contact, Lead } from '@/lib/types';
import { Button } from '@/components/ui/button';
import type { LeadStatusMeta } from './contacts-table';

interface ContactCardProps {
    contact: Contact | null;
    linkedLead?: Lead | null;
    leadStatusMeta?: LeadStatusMeta | null;
    onEdit?: (contact: Contact) => void;
    onCreateLead?: (contact: Contact) => void;
    onSendMessage?: (contact: Contact) => void;
}

export function ContactCard({
    contact,
    linkedLead,
    leadStatusMeta,
    onEdit,
    onCreateLead,
    onSendMessage,
}: ContactCardProps) {
    if (!contact) {
        return (
            <div className="rounded-xl bg-[#111] border border-dashed border-[#222] p-6 flex items-center justify-center text-sm text-[#666]">
                Select a contact from the table to view details
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-[#111] border border-[#222] p-5 lg:p-6 flex flex-col gap-4 lg:gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                        <UserCircle2 className="w-6 h-6 text-[#a3a3a3]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white leading-tight">
                            {contact.name}
                        </h2>
                        <p className="text-xs text-[#666]">
                            {contact.role} @ {contact.company}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {leadStatusMeta && (
                        <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: leadStatusMeta.bgColor,
                                color: leadStatusMeta.color,
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: leadStatusMeta.color }}
                            />
                            Linked Lead: {leadStatusMeta.label}
                        </span>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-[#333] text-[#a3a3a3] hover:bg-[#222] hover:text-white h-8 px-3 text-xs"
                        onClick={() => onEdit?.(contact)}
                    >
                        Edit
                    </Button>
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {/* Basic info */}
                <div className="space-y-3 md:col-span-1">
                    <h3 className="text-xs font-semibold text-[#777] uppercase tracking-wider">
                        Contact Details
                    </h3>
                    <div className="space-y-2 text-sm">
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
                        <div className="flex items-center gap-2 text-[#a3a3a3]">
                            <Building2 className="w-4 h-4 text-[#666]" />
                            <span>{contact.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#a3a3a3]">
                            <UserCircle2 className="w-4 h-4 text-[#666]" />
                            <span>{contact.role}</span>
                        </div>
                    </div>

                    {(contact.linkedinUrl || contact.twitterUrl) && (
                        <div className="space-y-2 text-sm pt-1">
                            <h4 className="text-xs font-semibold text-[#777] uppercase tracking-wider">
                                Social
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {contact.linkedinUrl && (
                                    <a
                                        href={contact.linkedinUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0a0a0a] border border-[#333] text-[#a3a3a3] hover:border-[#444] hover:text-white"
                                    >
                                        <Link2 className="w-3 h-3 text-[#60a5fa]" />
                                        LinkedIn
                                    </a>
                                )}
                                {contact.twitterUrl && (
                                    <a
                                        href={contact.twitterUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0a0a0a] border border-[#333] text-[#a3a3a3] hover:border-[#444] hover:text-white"
                                    >
                                        <Link2 className="w-3 h-3 text-[#38bdf8]" />
                                        Twitter
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tags + notes */}
                <div className="space-y-3 md:col-span-1">
                    <h3 className="text-xs font-semibold text-[#777] uppercase tracking-wider">
                        Context
                    </h3>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                            {contact.tags.length > 0 ? (
                                contact.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border border-[#333] text-[#a3a3a3] bg-[#0a0a0a]"
                                    >
                                        <Tag className="w-3 h-3 text-[#555]" />
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-[#555]">
                                    No tags added yet
                                </span>
                            )}
                        </div>
                        <div className="mt-2">
                            <p className="text-xs font-semibold text-[#777] uppercase tracking-wider mb-1">
                                Notes
                            </p>
                            <p className="text-sm text-[#a3a3a3] leading-relaxed">
                                {contact.notes || 'No notes yet.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Linked lead / actions */}
                <div className="space-y-3 md:col-span-1">
                    <h3 className="text-xs font-semibold text-[#777] uppercase tracking-wider">
                        Related Records
                    </h3>
                    <div className="space-y-3">
                        {linkedLead ? (
                            <div className="rounded-lg bg-[#0b0b0b] border border-[#262626] p-3 flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-[#a855f7]" />
                                        <span className="text-xs font-semibold text-[#e5e5e5]">
                                            Linked Lead
                                        </span>
                                    </div>
                                    {leadStatusMeta && (
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                                            style={{
                                                backgroundColor: leadStatusMeta.bgColor,
                                                color: leadStatusMeta.color,
                                            }}
                                        >
                                            {leadStatusMeta.label}
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-[#a3a3a3] space-y-1">
                                    <p className="font-medium text-[#e5e5e5]">
                                        {linkedLead.name}
                                    </p>
                                    <p>{linkedLead.company}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-lg bg-[#0b0b0b] border border-dashed border-[#262626] p-3 text-xs text-[#666]">
                                No linked lead yet. Create one to add this contact into your sales
                                pipeline.
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 pt-1">
                            <Button
                                size="sm"
                                className="bg-[#730404] text-white hover:bg-[#8b1a1a] h-8 px-3 text-xs"
                                onClick={() => onSendMessage?.(contact)}
                            >
                                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                                Send Message
                            </Button>
                            {!linkedLead && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-[#333] text-[#a3a3a3] hover:bg-[#222] hover:text-white h-8 px-3 text-xs"
                                    onClick={() => onCreateLead?.(contact)}
                                >
                                    <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                                    Create Lead
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

