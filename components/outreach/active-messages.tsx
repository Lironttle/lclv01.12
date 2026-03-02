'use client';

import React from 'react';
import type { OutreachMessage } from '@/lib/types';
import { OUTREACH_STATUS_CONFIG } from '@/lib/constants';
import { MailOpen, Reply, Eye, ArrowRight, AlertCircle } from 'lucide-react';

interface ActiveMessagesProps {
    messages: OutreachMessage[];
    onViewConversation?: (message: OutreachMessage) => void;
    onFollowUp?: (message: OutreachMessage) => void;
}

function formatTime(date?: Date): string {
    if (!date) return '';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
}

export function ActiveMessages({
    messages,
    onViewConversation,
    onFollowUp,
}: ActiveMessagesProps) {
    if (messages.length === 0) {
        return (
            <div className="rounded-xl bg-[#111] border border-[#222] p-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <MailOpen className="w-5 h-5 text-[#555]" />
                </div>
                <p className="text-sm text-[#666]">No active outreach awaiting replies.</p>
                <p className="text-xs text-[#444]">
                    Sent messages will appear here until they receive a reply.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-[#111] border border-[#222] p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
                        <MailOpen className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white">Active Messages</h2>
                        <p className="text-[11px] text-[#666]">
                            Sent messages awaiting a reply
                        </p>
                    </div>
                </div>
                <span className="text-[11px] text-[#555] font-mono">
                    {messages.length} active
                </span>
            </div>

            <div className="space-y-2">
                {messages.map((msg) => {
                    const config = OUTREACH_STATUS_CONFIG[msg.status];

                    return (
                        <div
                            key={msg.id}
                            className="group rounded-lg border border-[#1a1a1a] bg-[#050505] hover:bg-[#0a0a0a] hover:border-[#333] transition-all duration-200 p-3 md:p-3.5 flex flex-col gap-2"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: config.bgColor }}
                                    >
                                        <MailOpen
                                            className="w-4 h-4"
                                            style={{ color: config.color }}
                                        />
                                    </div>
                                    <div className="min-w-0 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white truncate">
                                                {msg.recipientName}
                                            </p>
                                            <span className="text-[11px] text-[#666] truncate hidden sm:inline">
                                                · {msg.recipientEmail}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#a3a3a3] line-clamp-2">
                                            {msg.subject}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                            <span
                                                className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                                style={{
                                                    color: config.color,
                                                    backgroundColor: config.bgColor,
                                                }}
                                            >
                                                {config.label}
                                            </span>
                                            {msg.campaign && (
                                                <span className="text-[10px] text-[#666] px-1.5 py-0.5 rounded-full bg-[#0a0a0a]">
                                                    {msg.campaign}
                                                </span>
                                            )}
                                            {msg.sentAt && (
                                                <span className="text-[10px] text-[#555] font-mono">
                                                    Sent {formatTime(msg.sentAt)}
                                                </span>
                                            )}
                                            {msg.openedAt && (
                                                <span className="text-[10px] text-[#22C55E] font-mono flex items-center gap-0.5">
                                                    <Eye className="w-3 h-3" />
                                                    Opened {formatTime(msg.openedAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <button
                                    type="button"
                                    onClick={() => onViewConversation?.(msg)}
                                    className="inline-flex items-center gap-1 text-[11px] text-[#a3a3a3] hover:text-white transition-colors"
                                >
                                    <Eye className="w-3 h-3" />
                                    View conversation
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onFollowUp?.(msg)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#730404] text-[11px] text-white hover:bg-[#8b1a1a] transition-colors"
                                >
                                    <Reply className="w-3 h-3" />
                                    Send follow-up
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

