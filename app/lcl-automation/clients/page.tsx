 'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Plus, Building2, Users, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ClientsTable } from '@/components/clients/clients-table';
import { ClientCard } from '@/components/clients/client-card';
import { RevenueChart } from '@/components/clients/revenue-chart';
import { AddClientDialog } from '@/components/clients/add-client-dialog';
import { mockClients, mockContacts } from '@/lib/mock-data';
import { CLIENT_STATUS_CONFIG } from '@/lib/constants';
import type { BillingCycle, Client, ClientStatus, Contact } from '@/lib/types';

type StatusFilter = ClientStatus | 'all';
type BillingFilter = BillingCycle | 'all';

function formatCurrency(value: number): string {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [contacts] = useState<Contact[]>(mockContacts);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [billingFilter, setBillingFilter] = useState<BillingFilter>('all');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(
        mockClients[0]?.id ?? null,
    );

    const contactsById = useMemo(() => {
        const map = new Map<string, Contact>();
        for (const contact of contacts) {
            map.set(contact.id, contact);
        }
        return map;
    }, [contacts]);

    const filteredClients = useMemo(() => {
        let result = clients;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((c) => {
                const contact = contactsById.get(c.contactId);
                return (
                    c.companyName.toLowerCase().includes(q) ||
                    contact?.name.toLowerCase().includes(q) ||
                    contact?.email.toLowerCase().includes(q)
                );
            });
        }

        if (statusFilter !== 'all') {
            result = result.filter((c) => c.status === statusFilter);
        }

        if (billingFilter !== 'all') {
            result = result.filter((c) => c.billingCycle === billingFilter);
        }

        return result;
    }, [clients, searchQuery, statusFilter, billingFilter, contactsById]);

    const stats = useMemo(() => {
        const total = clients.length;
        const totalMRR = clients.reduce((sum, c) => sum + c.mrr, 0);
        const totalContractValue = clients.reduce((sum, c) => sum + c.contractValue, 0);
        const atRisk = clients.filter((c) => c.status === 'at-risk').length;
        const churned = clients.filter((c) => c.status === 'churned').length;

        return { total, totalMRR, totalContractValue, atRisk, churned };
    }, [clients]);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setStatusFilter('all');
        setBillingFilter('all');
    }, []);

    const handleAddClient = useCallback(() => {
        setEditingClient(null);
        setDialogOpen(true);
    }, []);

    const handleEditClient = useCallback((client: Client) => {
        setEditingClient(client);
        setDialogOpen(true);
    }, []);

    const handleSaveClient = useCallback(
        (data: Omit<Client, 'id'>) => {
            if (editingClient) {
                setClients((prev) =>
                    prev.map((c) => (c.id === editingClient.id ? { ...c, ...data } : c)),
                );
            } else {
                const id = `cl-${Date.now()}`;
                const newClient: Client = { ...data, id };
                setClients((prev) => [newClient, ...prev]);
                setSelectedClientId(id);
            }
        },
        [editingClient],
    );

    const selectedClient = useMemo(
        () => clients.find((c) => c.id === selectedClientId) ?? null,
        [clients, selectedClientId],
    );

    const selectedContact = useMemo(
        () => (selectedClient ? contactsById.get(selectedClient.contactId) ?? null : null),
        [selectedClient, contactsById],
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#730404]" />
                        Clients
                    </h1>
                    <p className="text-sm text-[#666] mt-1">
                        Track active clients, revenue, and project workload.
                    </p>
                </div>
                <Button
                    onClick={handleAddClient}
                    className="bg-[#730404] text-white hover:bg-[#8b1a1a] transition-all duration-200 shadow-lg shadow-[#730404]/20 hover:shadow-[#730404]/30 h-10 px-5"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    {
                        label: 'Total Clients',
                        value: stats.total.toString(),
                        icon: Users,
                        color: '#3B82F6',
                    },
                    {
                        label: 'Total MRR',
                        value: formatCurrency(stats.totalMRR),
                        icon: DollarSign,
                        color: '#22C55E',
                    },
                    {
                        label: 'Contract Value',
                        value: formatCurrency(stats.totalContractValue),
                        icon: DollarSign,
                        color: '#F59E0B',
                    },
                    {
                        label: 'At Risk / Churned',
                        value: `${stats.atRisk}/${stats.churned}`,
                        icon: AlertTriangle,
                        color: '#EF4444',
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
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">
                            Filters
                        </span>
                    </div>
                    <div className="text-xs text-[#666] font-mono hidden sm:block">
                        {filteredClients.length === clients.length
                            ? `${clients.length} clients`
                            : `${filteredClients.length} of ${clients.length} clients`}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="flex-1 min-w-0">
                        <Input
                            placeholder="Search by company or contact..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#555] focus-visible:ring-[#730404] h-9 text-sm"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={(val) => setStatusFilter(val as StatusFilter)}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Statuses</SelectItem>
                            {(Object.entries(CLIENT_STATUS_CONFIG) as [
                                ClientStatus,
                                (typeof CLIENT_STATUS_CONFIG)[keyof typeof CLIENT_STATUS_CONFIG],
                            ][]).map(([key, config]) => (
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
                    <Select
                        value={billingFilter}
                        onValueChange={(val) => setBillingFilter(val as BillingFilter)}
                    >
                        <SelectTrigger className="w-full sm:w-[160px] bg-[#0a0a0a] border-[#222] text-sm h-9 focus:ring-[#730404]">
                            <SelectValue placeholder="Billing" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-[#222]">
                            <SelectItem value="all">All Billing</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchQuery || statusFilter !== 'all' || billingFilter !== 'all') && (
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

            <div className="grid grid-cols-1 xl:grid-cols-[1.6fr,1.1fr] gap-5 items-start">
                <div className="space-y-4">
                    <ClientsTable
                        clients={filteredClients}
                        contactsById={contactsById}
                        onRowClick={(client) => setSelectedClientId(client.id)}
                        onEditClient={handleEditClient}
                    />
                    <RevenueChart
                        clients={clients}
                        activeClientId={selectedClientId}
                        onClientClick={setSelectedClientId}
                    />
                </div>
                <div>
                    <ClientCard
                        client={selectedClient}
                        contact={selectedContact}
                        onEditClient={handleEditClient}
                    />
                </div>
            </div>

            <AddClientDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                contacts={contacts}
                editingClient={editingClient}
                onSave={handleSaveClient}
            />
        </div>
    );
}
