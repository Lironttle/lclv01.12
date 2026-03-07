'use client';

import React, { useMemo, useState, useCallback } from 'react';
import {
    MessageSquare,
    Mail,
    MailOpen,
    Reply,
    AlertCircle,
    Clock,
} from 'lucide-react';
import type { OutreachMessage, OutreachMessageStatus } from '@/lib/types';
import { mockOutreachMessages } from '@/lib/mock-data';
import { OUTREACH_STATUS_CONFIG } from '@/lib/constants';
import { MessageQueue } from '@/components/outreach/message-queue';
import { ActiveMessages } from '@/components/outreach/active-messages';
import { MessageReplies } from '@/components/outreach/message-replies';
import {
    MessageComposer,
    type ComposePayload,
} from '@/components/outreach/message-composer';

type OutreachTab = 'queue' | 'active' | 'replies';

function isFuture(date: Date) {
    return date.getTime() > Date.now();
}

export default function OutreachPage() {
    const [messages, setMessages] = useState<OutreachMessage[]>(mockOutreachMessages);
    const [activeTab, setActiveTab] = useState<OutreachTab>('queue');

    const stats = useMemo(() => {
        const total = messages.length;
        const queued = messages.filter((m) => m.status === 'queued').length;
        const active = messages.filter(
            (m) => m.status === 'sent' || m.status === 'opened',
        ).length;
        const replied = messages.filter((m) => m.status === 'replied').length;
        const bounced = messages.filter((m) => m.status === 'bounced').length;

        return { total, queued, active, replied, bounced };
    }, [messages]);

    const queueMessages = useMemo(
        () => messages.filter((m) => m.status === 'queued'),
        [messages],
    );
    const activeMessages = useMemo(
        () => messages.filter((m) => m.status === 'sent' || m.status === 'opened'),
        [messages],
    );
    const replyMessages = useMemo(
        () => messages.filter((m) => m.status === 'replied'),
        [messages],
    );

    const updateStatus = useCallback(
        (id: string, status: OutreachMessageStatus, extra: Partial<OutreachMessage> = {}) => {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === id
                        ? {
                            ...m,
                            status,
                            ...extra,
                        }
                        : m,
                ),
            );
        },
        [],
    );

    const handleSendNowFromQueue = useCallback(
        (message: OutreachMessage) => {
            updateStatus(message.id, 'sent', {
                scheduledAt: undefined,
                sentAt: new Date(),
            });
            setActiveTab('active');
        },
        [updateStatus],
    );

    const handleDeleteFromQueue = useCallback((message: OutreachMessage) => {
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
    }, []);

    const handleMarkHandled = useCallback((message: OutreachMessage) => {
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
    }, []);

    const handleComposeSend = useCallback((payload: ComposePayload) => {
        const id = `om-${Date.now()}`;
        const now = new Date();

        let status: OutreachMessageStatus = 'sent';
        let scheduledAt: Date | undefined;
        let sentAt: Date | undefined = now;

        if (payload.scheduleAt) {
            const scheduled = new Date(payload.scheduleAt);
            if (isFuture(scheduled)) {
                status = 'queued';
                scheduledAt = scheduled;
                sentAt = undefined;
            }
        }

        const newMessage: OutreachMessage = {
            id,
            recipientId: '',
            recipientName: payload.recipientName,
            recipientEmail: payload.recipientEmail,
            subject: payload.subject,
            body: payload.body,
            status,
            scheduledAt,
            sentAt,
            campaign: 'Manual outreach',
            replyCount: 0,
        };

        setMessages((prev) => [newMessage, ...prev]);

        setActiveTab(status === 'queued' ? 'queue' : 'active');
    }, []);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#730404]" />
                        Outreach
                    </h1>
                    <p className="text-sm text-[#666] mt-1 max-w-2xl">
                        Track every message from queue → sent → reply. See what is queued, who
                        is waiting, and which conversations need action.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                    {
                        label: 'Total messages',
                        value: stats.total,
                        icon: Mail,
                        color: '#3B82F6',
                    },
                    {
                        label: 'Queued',
                        value: stats.queued,
                        icon: Clock,
                        color: '#A3A3A3',
                    },
                    {
                        label: 'Active',
                        value: stats.active,
                        icon: MailOpen,
                        color: '#F59E0B',
                    },
                    {
                        label: 'Replied',
                        value: stats.replied,
                        icon: Reply,
                        color: '#22C55E',
                    },
                    {
                        label: 'Bounced',
                        value: stats.bounced,
                        icon: AlertCircle,
                        color: '#EF4444',
                    },
                ].map((stat, i) => (
                    <div
                        key={stat.label}
                        className="rounded-xl bg-[#111] border border-[#222] p-4 flex items-center gap-3 hover:border-[#333] hover:bg-[#141414] transition-all duration-300 animate-fade-in"
                        style={{
                            animationDelay: `${i * 70}ms`,
                            animationFillMode: 'backwards',
                        }}
                    >
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${stat.color}20` }}
                        >
                            <stat.icon
                                className="w-4 h-4"
                                style={{ color: stat.color }}
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-[#666] uppercase tracking-wider truncate">
                                {stat.label}
                            </p>
                            <p className="text-lg font-bold font-mono text-white">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-full bg-[#050505]/80 backdrop-blur-sm border border-[#222] p-1 text-xs">
                    {(
                        [
                            ['queue', 'Queue'],
                            ['active', 'Active'],
                            ['replies', 'Replies'],
                        ] as [OutreachTab, string][]
                    ).map(([key, label]) => {
                        const isActive = activeTab === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setActiveTab(key)}
                                className="relative px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
                                style={{
                                    backgroundColor: isActive ? '#730404' : 'transparent',
                                    color: isActive ? '#ffffff' : '#a3a3a3',
                                }}
                            >
                                {key === 'queue' && <Clock className="w-3 h-3" />}
                                {key === 'active' && <MailOpen className="w-3 h-3" />}
                                {key === 'replies' && <Reply className="w-3 h-3" />}
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,1.1fr] gap-4 xl:gap-6 items-start">
                <div className="space-y-4">
                    {activeTab === 'queue' && (
                        <MessageQueue
                            messages={queueMessages}
                            onSendNow={handleSendNowFromQueue}
                            onDelete={handleDeleteFromQueue}
                        />
                    )}
                    {activeTab === 'active' && (
                        <ActiveMessages
                            messages={activeMessages}
                        />
                    )}
                    {activeTab === 'replies' && (
                        <MessageReplies
                            messages={replyMessages}
                            onMarkHandled={handleMarkHandled}
                        />
                    )}
                </div>

                <div className="space-y-4">
                    <MessageComposer onSend={handleComposeSend} />
                </div>
            </div>
        </div>
    );
}

