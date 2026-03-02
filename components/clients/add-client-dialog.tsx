'use client';

import React, { useCallback, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BillingCycle, Client, ClientStatus, Contact } from '@/lib/types';
import { CLIENT_STATUS_CONFIG } from '@/lib/constants';
import { Loader2, UserPlus } from 'lucide-react';

interface AddClientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contacts: Contact[];
    editingClient?: Client | null;
    onSave: (client: Omit<Client, 'id'>) => void;
}

type FormState = {
    companyName: string;
    contactId: string;
    status: ClientStatus;
    contractValue: string;
    mrr: string;
    startDate: string;
    billingCycle: BillingCycle;
    nextInvoiceDate: string;
    projects: string;
    notes: string;
};

const INITIAL_FORM: FormState = {
    companyName: '',
    contactId: '',
    status: 'active',
    contractValue: '',
    mrr: '',
    startDate: '',
    billingCycle: 'monthly',
    nextInvoiceDate: '',
    projects: '',
    notes: '',
};

export function AddClientDialog({
    open,
    onOpenChange,
    contacts,
    editingClient,
    onSave,
}: AddClientDialogProps) {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (editingClient) {
            setForm({
                companyName: editingClient.companyName,
                contactId: editingClient.contactId,
                status: editingClient.status,
                contractValue: editingClient.contractValue.toString(),
                mrr: editingClient.mrr.toString(),
                startDate: editingClient.startDate.toISOString().split('T')[0],
                billingCycle: editingClient.billingCycle,
                nextInvoiceDate: editingClient.nextInvoiceDate.toISOString().split('T')[0],
                projects: editingClient.projects.join(', '),
                notes: editingClient.notes,
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setErrors({});
    }, [editingClient, open]);

    const updateField = useCallback(
        (field: keyof FormState, value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) {
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next[field];
                    return next;
                });
            }
        },
        [errors],
    );

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.companyName.trim()) newErrors.companyName = 'Company is required';
        if (!form.contactId) newErrors.contactId = 'Primary contact is required';

        if (!form.contractValue.trim()) {
            newErrors.contractValue = 'Contract value is required';
        } else if (isNaN(Number(form.contractValue)) || Number(form.contractValue) < 0) {
            newErrors.contractValue = 'Must be a positive number';
        }

        if (!form.mrr.trim()) {
            newErrors.mrr = 'MRR is required';
        } else if (isNaN(Number(form.mrr)) || Number(form.mrr) < 0) {
            newErrors.mrr = 'Must be a positive number';
        }

        if (!form.startDate) newErrors.startDate = 'Start date is required';
        if (!form.nextInvoiceDate) newErrors.nextInvoiceDate = 'Next invoice date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 400));

        const projects = form.projects
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean);

        onSave({
            companyName: form.companyName.trim(),
            contactId: form.contactId,
            status: form.status,
            contractValue: Number(form.contractValue),
            mrr: Number(form.mrr),
            startDate: new Date(form.startDate),
            billingCycle: form.billingCycle,
            nextInvoiceDate: new Date(form.nextInvoiceDate),
            projects,
            notes: form.notes.trim(),
        });

        setSaving(false);
        onOpenChange(false);
        setForm(INITIAL_FORM);
    };

    const isEditing = !!editingClient;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <div className="w-8 h-8 rounded-lg bg-[#730404]/20 flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-[#dc2626]" />
                        </div>
                        {isEditing ? 'Edit Client' : 'Add New Client'}
                    </DialogTitle>
                    <DialogDescription className="text-[#666]">
                        {isEditing
                            ? 'Update the client information below.'
                            : 'Fill in the details to create a new client.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="client-company-name"
                                className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                            >
                                Company <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="client-company-name"
                                placeholder="CloudNine Dev"
                                value={form.companyName}
                                onChange={(e) => updateField('companyName', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${
                                    errors.companyName ? 'border-[#EF4444]' : ''
                                }`}
                            />
                            {errors.companyName && (
                                <p className="text-[#EF4444] text-xs">{errors.companyName}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                            >
                                Primary Contact <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Select
                                value={form.contactId}
                                onValueChange={(val) => updateField('contactId', val)}
                            >
                                <SelectTrigger className={`bg-[#0a0a0a] border-[#222] text-white focus:ring-[#730404] ${
                                    errors.contactId ? 'border-[#EF4444]' : ''
                                }`}>
                                    <SelectValue placeholder="Select contact" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#222]">
                                    {contacts.map((contact) => (
                                        <SelectItem key={contact.id} value={contact.id}>
                                            <span className="flex flex-col">
                                                <span>{contact.name}</span>
                                                <span className="text-xs text-[#666]">
                                                    {contact.company}
                                                </span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.contactId && (
                                <p className="text-[#EF4444] text-xs">{errors.contactId}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Status
                            </Label>
                            <Select
                                value={form.status}
                                onValueChange={(val) =>
                                    updateField('status', val as ClientStatus)
                                }
                            >
                                <SelectTrigger className="bg-[#0a0a0a] border-[#222] text-white focus:ring-[#730404]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#222]">
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
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Billing Cycle
                            </Label>
                            <Select
                                value={form.billingCycle}
                                onValueChange={(val) =>
                                    updateField('billingCycle', val as BillingCycle)
                                }
                            >
                                <SelectTrigger className="bg-[#0a0a0a] border-[#222] text-white focus:ring-[#730404]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#222]">
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="annual">Annual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="client-contract-value"
                                className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                            >
                                Contract Value (USD){' '}
                                <span className="text-[#EF4444]">*</span>
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] text-sm">
                                    $
                                </span>
                                <Input
                                    id="client-contract-value"
                                    type="number"
                                    min={0}
                                    placeholder="120000"
                                    value={form.contractValue}
                                    onChange={(e) =>
                                        updateField('contractValue', e.target.value)
                                    }
                                    className={`pl-7 bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] font-mono ${
                                        errors.contractValue ? 'border-[#EF4444]' : ''
                                    }`}
                                />
                            </div>
                            {errors.contractValue && (
                                <p className="text-[#EF4444] text-xs">
                                    {errors.contractValue}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="client-mrr"
                                className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                            >
                                MRR (USD) <span className="text-[#EF4444]">*</span>
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] text-sm">
                                    $
                                </span>
                                <Input
                                    id="client-mrr"
                                    type="number"
                                    min={0}
                                    placeholder="10000"
                                    value={form.mrr}
                                    onChange={(e) => updateField('mrr', e.target.value)}
                                    className={`pl-7 bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] font-mono ${
                                        errors.mrr ? 'border-[#EF4444]' : ''
                                    }`}
                                />
                            </div>
                            {errors.mrr && (
                                <p className="text-[#EF4444] text-xs">{errors.mrr}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="client-start-date"
                                className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                            >
                                Start Date <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="client-start-date"
                                type="date"
                                value={form.startDate}
                                onChange={(e) => updateField('startDate', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white focus-visible:ring-[#730404] ${
                                    errors.startDate ? 'border-[#EF4444]' : ''
                                }`}
                            />
                            {errors.startDate && (
                                <p className="text-[#EF4444] text-xs">{errors.startDate}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="client-next-invoice"
                                className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                            >
                                Next Invoice Date{' '}
                                <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="client-next-invoice"
                                type="date"
                                value={form.nextInvoiceDate}
                                onChange={(e) =>
                                    updateField('nextInvoiceDate', e.target.value)
                                }
                                className={`bg-[#0a0a0a] border-[#222] text-white focus-visible:ring-[#730404] ${
                                    errors.nextInvoiceDate ? 'border-[#EF4444]' : ''
                                }`}
                            />
                            {errors.nextInvoiceDate && (
                                <p className="text-[#EF4444] text-xs">
                                    {errors.nextInvoiceDate}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="client-projects"
                            className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                        >
                            Projects
                        </Label>
                        <Input
                            id="client-projects"
                            placeholder="CRM Automation, Email Sequences"
                            value={form.projects}
                            onChange={(e) => updateField('projects', e.target.value)}
                            className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                        />
                        <p className="text-[10px] text-[#555]">
                            Separate project names with commas.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="client-notes"
                            className="text-[#a3a3a3] text-xs uppercase tracking-wider"
                        >
                            Notes
                        </Label>
                        <Textarea
                            id="client-notes"
                            placeholder="Add any relevant notes about this client..."
                            value={form.notes}
                            onChange={(e) => updateField('notes', e.target.value)}
                            rows={3}
                            className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#730404] text-white hover:bg-[#8b1a1a] transition-colors duration-200"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : isEditing ? (
                            'Update Client'
                        ) : (
                            'Add Client'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

