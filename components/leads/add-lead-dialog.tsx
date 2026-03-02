'use client';

import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
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
import { LEAD_STATUS_CONFIG, LEAD_SOURCES } from '@/lib/constants';
import type { Lead, LeadStatus, LeadSource } from '@/lib/types';
import { UserPlus, Loader2 } from 'lucide-react';

interface AddLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingLead?: Lead | null;
    onSave: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
}

const INITIAL_FORM = {
    name: '',
    email: '',
    company: '',
    phone: '',
    status: 'new' as LeadStatus,
    source: 'website' as LeadSource,
    value: '',
    notes: '',
};

export function AddLeadDialog({
    open,
    onOpenChange,
    editingLead,
    onSave,
}: AddLeadDialogProps) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    // Sync form when editing lead changes
    React.useEffect(() => {
        if (editingLead) {
            setForm({
                name: editingLead.name,
                email: editingLead.email,
                company: editingLead.company,
                phone: editingLead.phone || '',
                status: editingLead.status,
                source: editingLead.source,
                value: editingLead.value.toString(),
                notes: editingLead.notes,
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setErrors({});
    }, [editingLead, open]);

    const updateField = useCallback(
        (field: string, value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            // Clear error on change
            if (errors[field]) {
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next[field];
                    return next;
                });
            }
        },
        [errors]
    );

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!form.company.trim()) newErrors.company = 'Company is required';
        if (!form.value.trim()) {
            newErrors.value = 'Value is required';
        } else if (isNaN(Number(form.value)) || Number(form.value) < 0) {
            newErrors.value = 'Must be a positive number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        // Simulate async save
        await new Promise((resolve) => setTimeout(resolve, 400));

        onSave({
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim(),
            phone: form.phone.trim() || undefined,
            status: form.status,
            source: form.source,
            value: Number(form.value),
            notes: form.notes.trim(),
            lastContact: new Date(),
        });

        setSaving(false);
        onOpenChange(false);
        setForm(INITIAL_FORM);
    };

    const isEditing = !!editingLead;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <div className="w-8 h-8 rounded-lg bg-[#730404]/20 flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-[#dc2626]" />
                        </div>
                        {isEditing ? 'Edit Lead' : 'Add New Lead'}
                    </DialogTitle>
                    <DialogDescription className="text-[#666]">
                        {isEditing
                            ? 'Update the lead information below.'
                            : 'Fill in the details to create a new lead.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lead-name" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Name <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="lead-name"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${errors.name ? 'border-[#EF4444]' : ''}`}
                            />
                            {errors.name && (
                                <p className="text-[#EF4444] text-xs">{errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lead-email" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Email <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="lead-email"
                                type="email"
                                placeholder="john@company.com"
                                value={form.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${errors.email ? 'border-[#EF4444]' : ''}`}
                            />
                            {errors.email && (
                                <p className="text-[#EF4444] text-xs">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Company + Phone row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lead-company" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Company <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="lead-company"
                                placeholder="Acme Inc"
                                value={form.company}
                                onChange={(e) => updateField('company', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${errors.company ? 'border-[#EF4444]' : ''}`}
                            />
                            {errors.company && (
                                <p className="text-[#EF4444] text-xs">{errors.company}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lead-phone" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Phone
                            </Label>
                            <Input
                                id="lead-phone"
                                placeholder="+1-555-0100"
                                value={form.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                            />
                        </div>
                    </div>

                    {/* Status + Source row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Status
                            </Label>
                            <Select
                                value={form.status}
                                onValueChange={(val) => updateField('status', val)}
                            >
                                <SelectTrigger
                                    id="lead-form-status"
                                    className="bg-[#0a0a0a] border-[#222] text-white focus:ring-[#730404]"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#222]">
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
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Source
                            </Label>
                            <Select
                                value={form.source}
                                onValueChange={(val) => updateField('source', val)}
                            >
                                <SelectTrigger
                                    id="lead-form-source"
                                    className="bg-[#0a0a0a] border-[#222] text-white focus:ring-[#730404]"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-[#222]">
                                    {(Object.entries(LEAD_SOURCES) as [LeadSource, string][]).map(
                                        ([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Value */}
                    <div className="space-y-2">
                        <Label htmlFor="lead-value" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                            Deal Value (USD) <span className="text-[#EF4444]">*</span>
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] text-sm">$</span>
                            <Input
                                id="lead-value"
                                type="number"
                                min={0}
                                placeholder="10000"
                                value={form.value}
                                onChange={(e) => updateField('value', e.target.value)}
                                className={`pl-7 bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] font-mono ${errors.value ? 'border-[#EF4444]' : ''}`}
                            />
                        </div>
                        {errors.value && (
                            <p className="text-[#EF4444] text-xs">{errors.value}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="lead-notes" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                            Notes
                        </Label>
                        <Textarea
                            id="lead-notes"
                            placeholder="Add any relevant notes about this lead..."
                            value={form.notes}
                            onChange={(e) => updateField('notes', e.target.value)}
                            rows={3}
                            className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] resize-none"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        id="lead-dialog-cancel"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="text-[#a3a3a3] hover:text-white hover:bg-[#222]"
                    >
                        Cancel
                    </Button>
                    <Button
                        id="lead-dialog-save"
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
                            'Update Lead'
                        ) : (
                            'Add Lead'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
