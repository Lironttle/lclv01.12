// =============================================================================
// LCL Portal - Constants
// =============================================================================

import type { NavItem } from './types';

// --- Navigation ---
export const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { label: 'Leads', href: '/leads', icon: 'Users' },
    { label: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { label: 'Pipeline', href: '/pipeline', icon: 'GitBranch' },
    { label: 'Outreach', href: '/outreach', icon: 'MessageSquare' },
    { label: 'Contacts', href: '/contacts', icon: 'Contact' },
    { label: 'Clients', href: '/clients', icon: 'Building2' },
    { label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
    { label: 'Settings', href: '/settings', icon: 'Settings' },
];

// --- Design Tokens ---
export const COLORS = {
    background: '#000000',
    card: '#111111',
    cardHover: '#1a1a1a',
    accent: '#730404',
    accentLight: '#8b1a1a',
    accentGlow: 'rgba(115, 4, 4, 0.3)',
    textPrimary: '#FFFFFF',
    textSecondary: '#A3A3A3',
    textMuted: '#666666',
    border: '#222222',
    borderHover: '#333333',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
} as const;

// --- Lead Status Labels & Colors ---
export const LEAD_STATUS_CONFIG = {
    new: { label: 'New', color: COLORS.info, bgColor: 'rgba(59, 130, 246, 0.15)' },
    contacted: { label: 'Contacted', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.15)' },
    qualified: { label: 'Qualified', color: COLORS.warning, bgColor: 'rgba(245, 158, 11, 0.15)' },
    proposal: { label: 'Proposal', color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
    negotiation: { label: 'Negotiation', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.15)' },
    won: { label: 'Won', color: COLORS.success, bgColor: 'rgba(34, 197, 94, 0.15)' },
    lost: { label: 'Lost', color: COLORS.error, bgColor: 'rgba(239, 68, 68, 0.15)' },
} as const;

// --- Task Priority Config ---
export const TASK_PRIORITY_CONFIG = {
    low: { label: 'Low', color: COLORS.textSecondary, bgColor: 'rgba(163, 163, 163, 0.15)' },
    medium: { label: 'Medium', color: COLORS.info, bgColor: 'rgba(59, 130, 246, 0.15)' },
    high: { label: 'High', color: COLORS.warning, bgColor: 'rgba(245, 158, 11, 0.15)' },
    urgent: { label: 'Urgent', color: COLORS.error, bgColor: 'rgba(239, 68, 68, 0.15)' },
} as const;

// --- Task Status Config ---
export const TASK_STATUS_CONFIG = {
    'todo': { label: 'To Do', color: COLORS.textSecondary },
    'in-progress': { label: 'In Progress', color: COLORS.info },
    'review': { label: 'Review', color: COLORS.warning },
    'done': { label: 'Done', color: COLORS.success },
} as const;

// --- Task Category Config ---
export const TASK_CATEGORY_CONFIG = {
    'lead-follow-up': { label: 'Lead Follow-up', color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
    'client-work': { label: 'Client Work', color: COLORS.info, bgColor: 'rgba(59, 130, 246, 0.15)' },
    'internal': { label: 'Internal', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.15)' },
    'pipeline': { label: 'Pipeline', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.15)' },
} as const;

// --- Pipeline Status Config ---
export const PIPELINE_STATUS_CONFIG = {
    draft: { label: 'Draft', color: COLORS.textSecondary, bgColor: 'rgba(163, 163, 163, 0.15)' },
    running: { label: 'Running', color: COLORS.info, bgColor: 'rgba(59, 130, 246, 0.15)' },
    paused: { label: 'Paused', color: COLORS.warning, bgColor: 'rgba(245, 158, 11, 0.15)' },
    completed: { label: 'Completed', color: COLORS.success, bgColor: 'rgba(34, 197, 94, 0.15)' },
    failed: { label: 'Failed', color: COLORS.error, bgColor: 'rgba(239, 68, 68, 0.15)' },
} as const;

// --- Outreach Status Config ---
export const OUTREACH_STATUS_CONFIG = {
    queued: { label: 'Queued', color: COLORS.textSecondary, bgColor: 'rgba(163, 163, 163, 0.15)' },
    sent: { label: 'Sent', color: COLORS.info, bgColor: 'rgba(59, 130, 246, 0.15)' },
    opened: { label: 'Opened', color: COLORS.warning, bgColor: 'rgba(245, 158, 11, 0.15)' },
    replied: { label: 'Replied', color: COLORS.success, bgColor: 'rgba(34, 197, 94, 0.15)' },
    bounced: { label: 'Bounced', color: COLORS.error, bgColor: 'rgba(239, 68, 68, 0.15)' },
} as const;

// --- Client Status Config ---
export const CLIENT_STATUS_CONFIG = {
    active: { label: 'Active', color: COLORS.success, bgColor: 'rgba(34, 197, 94, 0.15)' },
    onboarding: { label: 'Onboarding', color: COLORS.info, bgColor: 'rgba(59, 130, 246, 0.15)' },
    'at-risk': { label: 'At Risk', color: COLORS.warning, bgColor: 'rgba(245, 158, 11, 0.15)' },
    churned: { label: 'Churned', color: COLORS.error, bgColor: 'rgba(239, 68, 68, 0.15)' },
} as const;

// --- Lead Sources ---
export const LEAD_SOURCES = {
    website: 'Website',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    'cold-outreach': 'Cold Outreach',
    event: 'Event',
} as const;

// --- Pipeline Stages (LMLFM) ---
export const PIPELINE_STAGES = [
    { key: 'leadMagnet', label: 'Lead Magnet', description: 'Content sent to attract leads' },
    { key: 'lead', label: 'Lead', description: 'Lead captured and qualified' },
    { key: 'followUp', label: 'Follow-up', description: 'Automated follow-up sequences' },
    { key: 'meeting', label: 'Meeting', description: 'Meeting booked and attended' },
] as const;

// --- Layout ---
export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const HEADER_HEIGHT = 64;
export const MAX_CONTENT_WIDTH = 1400;
export const CONTENT_PADDING = 24;

// --- Breakpoints ---
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
} as const;
