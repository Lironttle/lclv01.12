'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { mockOutreachMessages } from '@/lib/mock-data';
import { OUTREACH_STATUS_CONFIG } from '@/lib/constants';
import {
    Mail,
    MailOpen,
    Reply,
    Clock,
    Send,
    AlertCircle,
    MessageSquare,
} from 'lucide-react';

const statusIconMap: Record<string, React.ElementType> = {
    queued: Clock,
    sent: Send,
    opened: MailOpen,
    replied: Reply,
    bounced: AlertCircle,
};

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

function getRelevantDate(msg: typeof mockOutreachMessages[0]): Date | undefined {
    return msg.repliedAt || msg.openedAt || msg.sentAt || msg.scheduledAt;
}

export function RecentOutreach() {
    // Sort by most recent activity
    const messages = [...mockOutreachMessages]
        .sort((a, b) => {
            const dateA = getRelevantDate(a)?.getTime() || 0;
            const dateB = getRelevantDate(b)?.getTime() || 0;
            return dateB - dateA;
        })
        .slice(0, 6);

    const repliedCount = mockOutreachMessages.filter((m) => m.status === 'replied').length;

    return (
        <div className="card-glow rounded-xl bg-[#111] border border-[#222] p-4 md:p-6 hover:border-[#333] transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-white">Recent Outreach</h3>
                        <p className="text-xs text-[#666]">
                            {repliedCount} replies · {mockOutreachMessages.length} total
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages list */}
            <div className="flex flex-col gap-1 flex-1">
                {messages.map((msg) => {
                    const config = OUTREACH_STATUS_CONFIG[msg.status];
                    const StatusIcon = statusIconMap[msg.status] || Mail;
                    const relevantDate = getRelevantDate(msg);

                    return (
                        <div
                            key={msg.id}
                            className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#0a0a0a] transition-all duration-200 cursor-pointer"
                        >
                            {/* Status icon */}
                            <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                style={{ backgroundColor: config.bgColor }}
                            >
                                <StatusIcon
                                    className="w-3.5 h-3.5"
                                    style={{ color: config.color }}
                                />
                            </div>

                            {/* Message info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-medium text-white truncate">
                                        {msg.recipientName}
                                    </span>
                                    <span className="text-[10px] text-[#666] whitespace-nowrap font-mono">
                                        {formatTime(relevantDate)}
                                    </span>
                                </div>
                                <p className="text-xs text-[#a3a3a3] truncate mt-0.5">{msg.subject}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                                        style={{
                                            color: config.color,
                                            backgroundColor: config.bgColor,
                                        }}
                                    >
                                        {config.label}
                                    </span>
                                    {msg.replyCount > 0 && (
                                        <span className="text-[10px] text-[#22C55E] font-mono flex items-center gap-0.5">
                                            <Reply className="w-2.5 h-2.5" /> {msg.replyCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
                <button className="text-xs text-[#730404] hover:text-[#b91c1c] transition-colors font-medium">
                    View all outreach →
                </button>
            </div>
        </div>
    );
}
