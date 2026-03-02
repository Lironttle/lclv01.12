'use client';

import React from 'react';
import type { OutreachMessage } from '@/lib/types';
import { OUTREACH_STATUS_CONFIG } from '@/lib/constants';
import { Clock, Send, Pause, Edit2, Trash2, Mail } from 'lucide-react';

interface MessageQueueProps {
    messages: OutreachMessage[];
    onSendNow?: (message: OutreachMessage) => void;
    onPause?: (message: OutreachMessage) => void;
    onEdit?: (message: OutreachMessage) => void;
    onDelete?: (message: OutreachMessage) => void;
}

export function MessageQueue({
    messages,
    onSendNow,
    onPause,
    onEdit,
    onDelete,
}: MessageQueueProps) {
    if (messages.length === 0) {
        return (
            <div className="rounded-xl bg-[#111] border border-[#222] p-10 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#555]" />
                </div>
                <p className="text-sm text-[#666]">No messages are currently queued.</p>
                <p className="text-xs text-[#444]">
                    Use the composer to schedule your next outreach.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-[#111] border border-[#222] p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-white">Message Queue</h2>
                        <p className="text-[11px] text-[#666]">
                            Scheduled messages awaiting send
                        </p>
                    </div>
                </div>
                <span className="text-[11px] text-[#555] font-mono">
                    {messages.length} queued
                </span>
            </div>

            <div className="divide-y divide-[#1a1a1a]">
                {messages.map((msg) => {
                    const config = OUTREACH_STATUS_CONFIG[msg.status];

                    return (
                        <div
                            key={msg.id}
                            className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                        >
                            <div className="flex items-start gap-3 min-w-0">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: config.bgColor }}
                                >
                                    <Mail
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
                                    <p className="text-xs text-[#a3a3a3] truncate">
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
                                        {msg.scheduledAt && (
                                            <span className="text-[10px] text-[#555] font-mono">
                                                Sends{' '}
                                                {msg.scheduledAt.toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => onPause?.(msg)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#222] bg-[#050505] text-[11px] text-[#a3a3a3] hover:bg-[#0a0a0a] hover:text-white transition-colors"
                                >
                                    <Pause className="w-3 h-3" />
                                    Pause
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSendNow?.(msg)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#730404] text-[11px] text-white hover:bg-[#8b1a1a] transition-colors"
                                >
                                    <Send className="w-3 h-3" />
                                    Send now
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onEdit?.(msg)}
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#222] text-[#777] hover:bg-[#111] hover:text-white transition-colors"
                                    aria-label="Edit message"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete?.(msg)}
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-[#222] text-[#773333] hover:bg-[#220000] hover:text-[#fca5a5] transition-colors"
                                    aria-label="Delete message"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

