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
import type { Contact } from '@/lib/types';
import { UserPlus, Loader2 } from 'lucide-react';

interface AddContactDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingContact?: Contact | null;
    onSave: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
}

const INITIAL_FORM = {
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    linkedinUrl: '',
    twitterUrl: '',
    tags: '',
    notes: '',
};

export function AddContactDialog({
    open,
    onOpenChange,
    editingContact,
    onSave,
}: AddContactDialogProps) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (editingContact) {
            setForm({
                name: editingContact.name,
                email: editingContact.email,
                phone: editingContact.phone || '',
                company: editingContact.company,
                role: editingContact.role,
                linkedinUrl: editingContact.linkedinUrl || '',
                twitterUrl: editingContact.twitterUrl || '',
                tags: editingContact.tags.join(', '),
                notes: editingContact.notes,
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setErrors({});
    }, [editingContact, open]);

    const updateField = useCallback(
        (field: keyof typeof INITIAL_FORM, value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }));
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
        if (!form.role.trim()) newErrors.role = 'Role is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 400));

        const tags = form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

        onSave({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim() || undefined,
            company: form.company.trim(),
            role: form.role.trim(),
            linkedinUrl: form.linkedinUrl.trim() || undefined,
            twitterUrl: form.twitterUrl.trim() || undefined,
            tags,
            notes: form.notes.trim(),
            leadId: editingContact?.leadId,
            lastInteraction: editingContact?.lastInteraction ?? new Date(),
        });

        setSaving(false);
        onOpenChange(false);
        setForm(INITIAL_FORM);
    };

    const isEditing = !!editingContact;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-white">
                        <div className="w-8 h-8 rounded-lg bg-[#730404]/20 flex items-center justify-center">
                            <UserPlus className="w-4 h-4 text-[#dc2626]" />
                        </div>
                        {isEditing ? 'Edit Contact' : 'Add New Contact'}
                    </DialogTitle>
                    <DialogDescription className="text-[#666]">
                        {isEditing
                            ? 'Update the contact information below.'
                            : 'Fill in the details to create a new contact.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact-name" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Name <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="contact-name"
                                placeholder="Sarah Chen"
                                value={form.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${errors.name ? 'border-[#EF4444]' : ''}`}
                            />
                            {errors.name && (
                                <p className="text-[#EF4444] text-xs">{errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-email" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Email <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="contact-email"
                                type="email"
                                placeholder="sarah@company.com"
                                value={form.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${errors.email ? 'border-[#EF4444]' : ''}`}
                            />
                            {errors.email && (
                                <p className="text-[#EF4444] text-xs">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact-company" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Company <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="contact-company"
                                placeholder="TechFlow Inc"
                                value={form.company}
                                onChange={(e) => updateField('company', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${errors.company ? 'border-[#EF4444]' : ''}`}
                            />
                            {errors.company && (
                                <p className="text-[#EF4444] text-xs">{errors.company}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-role" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Role <span className="text-[#EF4444]">*</span>
                            </Label>
                            <Input
                                id="contact-role"
                                placeholder="CTO"
                                value={form.role}
                                onChange={(e) => updateField('role', e.target.value)}
                                className={`bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404] ${errors.role ? 'border-[#EF4444]' : ''}`}
                            />
                            {errors.role && (
                                <p className="text-[#EF4444] text-xs">{errors.role}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact-phone" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Phone
                            </Label>
                            <Input
                                id="contact-phone"
                                placeholder="+1-555-0100"
                                value={form.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-tags" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Tags
                            </Label>
                            <Input
                                id="contact-tags"
                                placeholder="decision-maker, enterprise, warm"
                                value={form.tags}
                                onChange={(e) => updateField('tags', e.target.value)}
                                className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                            />
                            <p className="text-[10px] text-[#555]">
                                Separate tags with commas.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contact-linkedin" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                LinkedIn URL
                            </Label>
                            <Input
                                id="contact-linkedin"
                                placeholder="https://linkedin.com/in/username"
                                value={form.linkedinUrl}
                                onChange={(e) => updateField('linkedinUrl', e.target.value)}
                                className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact-twitter" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                                Twitter URL
                            </Label>
                            <Input
                                id="contact-twitter"
                                placeholder="https://twitter.com/username"
                                value={form.twitterUrl}
                                onChange={(e) => updateField('twitterUrl', e.target.value)}
                                className="bg-[#0a0a0a] border-[#222] text-white placeholder:text-[#444] focus-visible:ring-[#730404]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact-notes" className="text-[#a3a3a3] text-xs uppercase tracking-wider">
                            Notes
                        </Label>
                        <Textarea
                            id="contact-notes"
                            placeholder="Add any relevant notes about this contact..."
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
                            'Update Contact'
                        ) : (
                            'Add Contact'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

