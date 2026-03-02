// =============================================================================
// LCL Portal - Type Definitions
// =============================================================================

// --- Lead Management ---
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export type LeadSource =
  | 'website'
  | 'referral'
  | 'linkedin'
  | 'cold-outreach'
  | 'event';

export type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  value: number;
  lastContact: Date;
  notes: string;
  createdAt: Date;
};

// --- Task Management ---
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskCategory =
  | 'lead-follow-up'
  | 'client-work'
  | 'internal'
  | 'pipeline';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  assignee: string;
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
};

// --- Pipeline ---
export type PipelineRunStatus =
  | 'draft'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed';

export type PipelineMetrics = {
  leadMagnetSent: number;
  leadsGenerated: number;
  followUpsSent: number;
  meetingsBooked: number;
};

export type PipelineRun = {
  id: string;
  campaignName: string;
  status: PipelineRunStatus;
  leadIds: string[];
  startedAt: Date;
  completedAt?: Date;
  metrics: PipelineMetrics;
};

// --- Outreach ---
export type OutreachMessageStatus =
  | 'queued'
  | 'sent'
  | 'opened'
  | 'replied'
  | 'bounced';

export type OutreachMessage = {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  status: OutreachMessageStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  openedAt?: Date;
  repliedAt?: Date;
  campaign: string;
  replyCount: number;
};

// --- Contacts ---
export type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  role: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  tags: string[];
  notes: string;
  leadId?: string;
  lastInteraction?: Date;
  createdAt: Date;
};

// --- Clients ---
export type ClientStatus = 'active' | 'onboarding' | 'at-risk' | 'churned';

export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export type Client = {
  id: string;
  companyName: string;
  contactId: string;
  status: ClientStatus;
  contractValue: number;
  mrr: number;
  startDate: Date;
  billingCycle: BillingCycle;
  nextInvoiceDate: Date;
  projects: string[];
  notes: string;
};

// --- Navigation ---
export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

// --- Dashboard Stats ---
export type StatCardData = {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
};
