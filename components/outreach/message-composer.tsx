'use client';

import React, { useState } from 'react';
import { Send, Clock, ChevronDown, Sparkles } from 'lucide-react';

export type ComposePayload = {
    recipientName: string;
    recipientEmail: string;
    subject: string;
    body: string;
    scheduleAt?: string | null;
};

interface MessageComposerProps {
    onSend: (payload: ComposePayload) => void;
    isSending?: boolean;
}

const TEMPLATES: { id: string; label: string; subject: string; body: string }[] = [
    {
        id: 'linkedin-intro',
        label: 'LinkedIn intro',
        subject: 'Quick idea for improving your workflows',
        body:
            'Hi {{firstName}},\n\nI came across {{company}} and thought a quick note might be helpful. ' +
            'We help teams automate repetitive workflows so they can focus on high-leverage work.\n\n' +
            'Would you be open to a brief call to see what this could look like for you?\n\nBest,\n{{senderName}}',
    },
    {
        id: 'lead-magnet-followup',
        label: 'Lead magnet follow-up',
        subject: 'How was the AI workflow guide?',
        body:
            'Hi {{firstName}},\n\nHope you enjoyed the AI workflow guide. Curious what stood out the most ' +
            'for your team at {{company}}.\n\nIf you like, I can walk through how we implement this for clients ' +
            'in 20 minutes.\n\nBest,\n{{senderName}}',
    },
    {
        id: 'referral-intro',
        label: 'Referral introduction',
        subject: '{{referrerName}} suggested we connect',
        body:
            'Hi {{firstName}},\n\n{{referrerName}} mentioned you might be exploring automation for {{company}}. ' +
            'We recently helped a similar team reduce manual ops time by 30–40%.\n\n' +
            'Would a quick intro call be useful?\n\nBest,\n{{senderName}}',
    },
];

export function MessageComposer({ onSend, isSending }: MessageComposerProps) {
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [scheduleAt, setScheduleAt] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    function handleApplyTemplate(id: string) {
        const template = TEMPLATES.find((t) => t.id === id);
        if (!template) return;
        setSelectedTemplate(id);
        if (!subject) {
            setSubject(template.subject);
        }
        if (!body) {
            setBody(template.body);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!recipientEmail.trim() || !subject.trim() || !body.trim()) {
            return;
        }

        onSend({
            recipientName: recipientName.trim() || recipientEmail.trim(),
            recipientEmail: recipientEmail.trim(),
            subject: subject.trim(),
            body: body.trim(),
            scheduleAt: scheduleAt || null,
        });

        setRecipientName('');
        setRecipientEmail('');
        setSubject('');
        setBody('');
        setScheduleAt(null);
        setSelectedTemplate(null);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-[#050505] border border-[#222] p-4 md:p-5 space-y-4"
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#730404]/20 flex items-center justify-center">
                        <Send className="w-4 h-4 text-[#f97373]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white">Message Composer</h2>
                        <p className="text-[11px] text-[#666]">
                            Send now or schedule your next outreach
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#a3a3a3]">
                        To (name)
                    </label>
                    <input
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full rounded-lg bg-[#020202] border border-[#222] px-3 py-2 text-xs text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#730404] focus:border-[#730404]"
                        placeholder="Sarah Chen"
                        autoComplete="off"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#a3a3a3]">
                        To (email) <span className="text-[#ef4444]">*</span>
                    </label>
                    <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full rounded-lg bg-[#020202] border border-[#222] px-3 py-2 text-xs text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#730404] focus:border-[#730404]"
                        placeholder="sarah@company.com"
                        autoComplete="off"
                        required
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-medium text-[#a3a3a3]">
                        Subject <span className="text-[#ef4444]">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#555]">Templates</span>
                        <div className="relative">
                            <select
                                value={selectedTemplate ?? ''}
                                onChange={(e) =>
                                    e.target.value && handleApplyTemplate(e.target.value)
                                }
                                className="appearance-none text-[11px] pl-2 pr-6 py-1 rounded-lg bg-[#020202] border border-[#222] text-[#a3a3a3] focus:outline-none focus:ring-1 focus:ring-[#730404] focus:border-[#730404]"
                            >
                                <option value="">Choose…</option>
                                {TEMPLATES.map((tpl) => (
                                    <option key={tpl.id} value={tpl.id}>
                                        {tpl.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 w-3.5 h-3.5 text-[#555]" />
                        </div>
                    </div>
                </div>
                <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-lg bg-[#020202] border border-[#222] px-3 py-2 text-xs text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#730404] focus:border-[#730404]"
                    placeholder="Quick idea for improving your workflows"
                    required
                />
            </div>

            <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-medium text-[#a3a3a3]">
                        Body <span className="text-[#ef4444]">*</span>
                    </label>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#555]">
                        <Sparkles className="w-3 h-3" />
                        Use <code className="text-[10px] bg-[#111] px-1 py-0.5 rounded">
                            {'{{firstName}}'}
                        </code>{' '}
                        variables
                    </span>
                </div>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg bg-[#020202] border border-[#222] px-3 py-2 text-xs text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#730404] focus:border-[#730404] resize-none"
                    placeholder="Write a concise, conversational message with a clear CTA…"
                    required
                />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="space-y-1.5 md:w-1/2">
                    <label className="text-[11px] font-medium text-[#a3a3a3] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Schedule (optional)
                    </label>
                    <input
                        type="datetime-local"
                        value={scheduleAt ?? ''}
                        onChange={(e) =>
                            setScheduleAt(e.target.value ? e.target.value : null)
                        }
                        className="w-full rounded-lg bg-[#020202] border border-[#222] px-3 py-2 text-xs text-white placeholder:text-[#444] focus:outline-none focus:ring-1 focus:ring-[#730404] focus:border-[#730404]"
                    />
                    <p className="text-[10px] text-[#555]">
                        Leave empty to send immediately. Future times will create a queued message.
                    </p>
                </div>

                <div className="flex md:justify-end items-center gap-2 pt-1">
                    <button
                        type="submit"
                        disabled={isSending}
                        className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#730404] text-xs font-medium text-white hover:bg-[#8b1a1a] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-[#730404]/20 hover:shadow-[#730404]/30"
                    >
                        <Send className="w-3.5 h-3.5" />
                        {isSending ? 'Sending…' : 'Send message'}
                    </button>
                </div>
            </div>
        </form>
    );
}

