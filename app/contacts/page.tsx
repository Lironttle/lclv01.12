'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Plus, Users, Link2, MessageCircle, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ContactsTable, type LeadStatusMeta } from '@/components/contacts/contacts-table';
import { ContactCard } from '@/components/contacts/contact-card';
import { AddContactDialog } from '@/components/contacts/add-contact-dialog';
import { mockContacts, mockLeads } from '@/lib/mock-data';
import { LEAD_STATUS_CONFIG } from '@/lib/constants';
import type { Contact, Lead, LeadStatus } from '@/lib/types';

function formatCount(value: number): string {
    return value.toString();
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>(mockContacts);

    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [tagFilter, setTagFilter] = useState<string>('all');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(
        mockContacts[0] ?? null
    );

    const leadsById = useMemo(() => {
        const map = new Map<string, Lead>();
        for (const lead of mockLeads) {
            map.set(lead.id, lead);
        }
        return map;
    }, []);

    const allRoles = useMemo(
        () => Array.from(new Set(contacts.map((c) => c.role))).sort(),
        [contacts]
    );

    const allTags = useMemo(
        () =>
            Array.from(
                new Set(contacts.flatMap((c) => c.tags))
            ).sort(),
        [contacts]
    );

    const filteredContacts = useMemo(() => {
        let result = contacts;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.email.toLowerCase().includes(q) ||
                    c.company.toLowerCase().includes(q)
            );
        }

        if (roleFilter !== 'all') {
            result = result.filter((c) => c.role === roleFilter);
        }

        if (tagFilter !== 'all') {
            result = result.filter((c) => c.tags.includes(tagFilter));
        }

        return result;
    }, [contacts, searchQuery, roleFilter, tagFilter]);

    const stats = useMemo(() => {
        const total = contacts.length;
        const withLinkedIn = contacts.filter((c) => !!c.linkedinUrl).length;
        const decisionMakers = contacts.filter((c) =>
            c.tags.includes('decision-maker')
        ).length;
        const activeThisWeek = contacts.filter((c) => {
            if (!c.lastInteraction) return false;
            const diff =
                Date.now() - c.lastInteraction.getTime();
            return diff <= 7 * 86400000;
        }).length;

        return { total, withLinkedIn, decisionMakers, activeThisWeek };
    }, [contacts]);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setRoleFilter('all');
        setTagFilter('all');
    }, []);

    const handleAddContact = useCallback(() => {
        setEditingContact(null);
        setDialogOpen(true);
    }, []);

    const handleEditContact = useCallback((contact: Contact) => {
        setEditingContact(contact);
        setDialogOpen(true);
    }, []);

    const handleSaveContact = useCallback(
        (data: Omit<Contact, 'id' | 'createdAt'>) => {
            if (editingContact) {
                setContacts((prev) =>
                    prev.map((c) =>
                        c.id === editingContact.id ? { ...c, ...data } : c
                    )
                );
            } else {
                const newContact: Contact = {
                    ...data,
                    id: `c${Date.now()}`,
                    createdAt: new Date(),
                };
                setContacts((prev) => [newContact, ...prev]);
                setSelectedContact(newContact);
            }
        },
        [editingContact]
    );

    const getLeadStatusMetaForContact = useCallback(
        (contact: Contact): LeadStatusMeta | null => {
            if (!contact.leadId) return null;
            const lead = leadsById.get(contact.leadId);
            if (!lead) return null;
            const statusConfig = LEAD_STATUS_CONFIG[lead.status as LeadStatus];
            if (!statusConfig) return null;
            return {
                label: statusConfig.label,
                color: statusConfig.color,
                bgColor: statusConfig.bgColor,
            };
        },
        [leadsById]
    );

    const selectedLead = useMemo(() => {
        if (!selectedContact?.leadId) return null;
        return leadsById.get(selectedContact.leadId) ?? null;
    }, [selectedContact, leadsById]);

    const selectedLeadStatusMeta = useMemo(
        () =>
            selectedContact
                ? getLeadStatusMetaForContact(selectedContact)
                : null,
        [selectedContact, getLeadStatusMetaForContact]
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        Contacts
                    </h1>
                    <p className="text-sm text-[#666] mt-1">
                        People database linked to your leads and clients
                    </p>
                </div>
                <Button
                    onClick={handleAddContact}
                    className="bg-[#730404] text-white hover:bg-[#8b1a1a] transition-all duration-200 shadow-lg shadow-[#730404]/20 hover:shadow-[#730404]/30 h-10 px-5"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    {
                        label: 'Total Contacts',
                        value: formatCount(stats.total),
                        icon: Users,
                        color: '#3B82F6',
                    },
                    {
                        label: 'With LinkedIn',
                        value: formatCount(stats.withLinkedIn),
                        icon: Link2,
                        color: '#22C55E',
                    },
                    {
                        label: 'Decision-Makers',
                        value: formatCount(stats.decisionMakers),
                        icon: Tags,
                        color: '#F59E0B',
                    },
                    {
                        label: 'Active This Week',
                        value: formatCount(stats.activeThisWeek),
                        icon: MessageCircle,
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

            <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[#a3a3a3]">
                        <Tags className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                            Filters
                        </span>
                    </div>
                    <div className="text-xs text-[#666] font-mono hidden sm:block">
                        {filteredContacts.length === contacts.length
                            ? `${contacts.length} contacts`
                            : `${filteredContacts.length} of ${contacts.length} contacts`}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="flex-1 min-w-0">
                        <Input
                            placeholder="Search contacts by name, email, or company..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#555] focus-visible:ring-[#730404] h-9 text-sm"
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onValueChange={setRoleFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Roles</SelectItem>
                            {allRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                    {role}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={tagFilter}
                        onValueChange={setTagFilter}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]">
                            <SelectValue placeholder="All Tags" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Tags</SelectItem>
                            {allTags.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                    {tag}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {(searchQuery || roleFilter !== 'all' || tagFilter !== 'all') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="text-[#a3a3a3] hover:text-white hover:bg-[#222] h-9 px-3 shrink-0"
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                    <ContactsTable
                        contacts={filteredContacts}
                        onRowClick={setSelectedContact}
                        onEditContact={handleEditContact}
                        getLeadStatusMeta={getLeadStatusMetaForContact}
                    />
                </div>
                <div className="xl:col-span-1">
                    <ContactCard
                        contact={selectedContact}
                        linkedLead={selectedLead}
                        leadStatusMeta={selectedLeadStatusMeta}
                        onEdit={handleEditContact}
                    />
                </div>
            </div>

            <AddContactDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingContact={editingContact}
                onSave={handleSaveContact}
            />
        </div>
    );
}

