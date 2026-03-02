import type { Lead, Task, PipelineRun, OutreachMessage, Contact, Client } from './types';

// Helper to create dates relative to now
const daysAgo = (days: number) => new Date(Date.now() - days * 86400000);
const daysFromNow = (days: number) => new Date(Date.now() + days * 86400000);

// --- Mock Leads ---
export const mockLeads: Lead[] = [
    { id: 'l1', name: 'Sarah Chen', email: 'sarah@techflow.io', company: 'TechFlow Inc', phone: '+1-555-0101', status: 'qualified', source: 'linkedin', value: 15000, lastContact: daysAgo(1), notes: 'Interested in AI automation for sales pipeline', createdAt: daysAgo(14) },
    { id: 'l2', name: 'Marcus Johnson', email: 'marcus@brightpath.co', company: 'BrightPath Solutions', status: 'proposal', source: 'referral', value: 28000, lastContact: daysAgo(2), notes: 'Referred by David Park. Needs full CRM automation.', createdAt: daysAgo(21) },
    { id: 'l3', name: 'Emily Rodriguez', email: 'emily@scalewise.com', company: 'ScaleWise', phone: '+1-555-0103', status: 'new', source: 'website', value: 8000, lastContact: daysAgo(0), notes: 'Downloaded lead magnet on AI workflows', createdAt: daysAgo(1) },
    { id: 'l4', name: 'James Liu', email: 'james@novahub.io', company: 'NovaHub', status: 'contacted', source: 'cold-outreach', value: 12000, lastContact: daysAgo(3), notes: 'Responded to LinkedIn DM, scheduling call', createdAt: daysAgo(7) },
    { id: 'l5', name: 'Olivia Martinez', email: 'olivia@greenleaf.co', company: 'GreenLeaf Digital', phone: '+1-555-0105', status: 'negotiation', source: 'event', value: 45000, lastContact: daysAgo(1), notes: 'Met at AI Summit 2024. Enterprise deal.', createdAt: daysAgo(30) },
    { id: 'l6', name: 'Daniel Kim', email: 'daniel@cloudnine.dev', company: 'CloudNine Dev', status: 'won', source: 'linkedin', value: 20000, lastContact: daysAgo(5), notes: 'Signed 6-month contract for automation suite', createdAt: daysAgo(45) },
    { id: 'l7', name: 'Aisha Patel', email: 'aisha@zenith.ai', company: 'Zenith AI', status: 'qualified', source: 'website', value: 35000, lastContact: daysAgo(2), notes: 'VP of Operations, needs workflow optimization', createdAt: daysAgo(10) },
    { id: 'l8', name: 'Robert Thompson', email: 'robert@ironclad.biz', company: 'Ironclad Business', phone: '+1-555-0108', status: 'lost', source: 'cold-outreach', value: 18000, lastContact: daysAgo(15), notes: 'Went with competitor. Keep for future follow-up.', createdAt: daysAgo(60) },
    { id: 'l9', name: 'Nina Volkov', email: 'nina@apexstream.com', company: 'ApexStream', status: 'new', source: 'linkedin', value: 22000, lastContact: daysAgo(0), notes: 'Connected on LinkedIn, interested in chatbot automation', createdAt: daysAgo(2) },
    { id: 'l10', name: 'Carlos Mendez', email: 'carlos@pulsedata.io', company: 'PulseData', status: 'contacted', source: 'referral', value: 30000, lastContact: daysAgo(4), notes: 'Referral from Olivia Martinez. Data pipeline needs.', createdAt: daysAgo(8) },
    { id: 'l11', name: 'Grace Wong', email: 'grace@stellar.tech', company: 'Stellar Technologies', status: 'proposal', source: 'website', value: 42000, lastContact: daysAgo(1), notes: 'Proposal sent for full-stack automation', createdAt: daysAgo(25) },
    { id: 'l12', name: 'Tom Anderson', email: 'tom@blueshift.co', company: 'BlueShift Co', status: 'new', source: 'event', value: 16000, lastContact: daysAgo(3), notes: 'Met at SaaS North conference', createdAt: daysAgo(5) },
];

// --- Mock Tasks ---
export const mockTasks: Task[] = [
    { id: 't1', title: 'Follow up with Sarah Chen', description: 'Send proposal document and schedule demo call', priority: 'high', status: 'todo', category: 'lead-follow-up', assignee: 'You', dueDate: daysFromNow(1), createdAt: daysAgo(2) },
    { id: 't2', title: 'Prepare BrightPath proposal', description: 'Create custom automation proposal for CRM workflow', priority: 'urgent', status: 'in-progress', category: 'lead-follow-up', assignee: 'You', dueDate: daysFromNow(0), createdAt: daysAgo(3) },
    { id: 't3', title: 'Update client onboarding flow', description: 'Revise n8n workflows for new client setup process', priority: 'medium', status: 'todo', category: 'internal', assignee: 'You', dueDate: daysFromNow(3), createdAt: daysAgo(5) },
    { id: 't4', title: 'CloudNine monthly review', description: 'Prepare monthly performance report and schedule call', priority: 'medium', status: 'review', category: 'client-work', assignee: 'You', dueDate: daysFromNow(2), createdAt: daysAgo(1) },
    { id: 't5', title: 'Fix pipeline webhook errors', description: 'Debug failing webhooks in lead magnet delivery flow', priority: 'high', status: 'in-progress', category: 'pipeline', assignee: 'You', dueDate: daysFromNow(0), createdAt: daysAgo(1) },
    { id: 't6', title: 'Create LinkedIn outreach templates', description: 'Write 5 new connection request message templates', priority: 'low', status: 'todo', category: 'internal', assignee: 'You', dueDate: daysFromNow(5), createdAt: daysAgo(2) },
    { id: 't7', title: 'GreenLeaf contract review', description: 'Review enterprise contract terms with legal', priority: 'urgent', status: 'todo', category: 'lead-follow-up', assignee: 'You', dueDate: daysFromNow(1), createdAt: daysAgo(1) },
    { id: 't8', title: 'Optimize email sequences', description: 'A/B test subject lines for cold outreach campaign', priority: 'medium', status: 'done', category: 'pipeline', assignee: 'You', dueDate: daysAgo(1), createdAt: daysAgo(7), completedAt: daysAgo(1) },
];

// --- Mock Pipeline Runs ---
export const mockPipelineRuns: PipelineRun[] = [
    { id: 'pr1', campaignName: 'Q1 LinkedIn Outreach', status: 'running', leadIds: ['l3', 'l4', 'l9'], startedAt: daysAgo(5), metrics: { leadMagnetSent: 150, leadsGenerated: 23, followUpsSent: 18, meetingsBooked: 4 } },
    { id: 'pr2', campaignName: 'SaaS Founders Campaign', status: 'completed', leadIds: ['l1', 'l2'], startedAt: daysAgo(30), completedAt: daysAgo(10), metrics: { leadMagnetSent: 200, leadsGenerated: 35, followUpsSent: 28, meetingsBooked: 8 } },
    { id: 'pr3', campaignName: 'AI Summit Follow-up', status: 'running', leadIds: ['l5', 'l12'], startedAt: daysAgo(3), metrics: { leadMagnetSent: 45, leadsGenerated: 12, followUpsSent: 8, meetingsBooked: 2 } },
    { id: 'pr4', campaignName: 'Cold Email Blast v3', status: 'paused', leadIds: ['l8'], startedAt: daysAgo(15), metrics: { leadMagnetSent: 500, leadsGenerated: 42, followUpsSent: 35, meetingsBooked: 6 } },
    { id: 'pr5', campaignName: 'Referral Network Push', status: 'draft', leadIds: [], startedAt: daysAgo(0), metrics: { leadMagnetSent: 0, leadsGenerated: 0, followUpsSent: 0, meetingsBooked: 0 } },
];

// --- Mock Outreach Messages ---
export const mockOutreachMessages: OutreachMessage[] = [
    { id: 'om1', recipientId: 'c1', recipientName: 'Sarah Chen', recipientEmail: 'sarah@techflow.io', subject: 'AI Automation for Your Sales Pipeline', body: 'Hi Sarah, I noticed TechFlow is scaling rapidly...', status: 'replied', sentAt: daysAgo(3), openedAt: daysAgo(2), repliedAt: daysAgo(1), campaign: 'Q1 LinkedIn Outreach', replyCount: 2 },
    { id: 'om2', recipientId: 'c2', recipientName: 'Marcus Johnson', recipientEmail: 'marcus@brightpath.co', subject: 'Custom CRM Automation Solution', body: 'Hi Marcus, David mentioned you might be interested...', status: 'opened', sentAt: daysAgo(2), openedAt: daysAgo(1), campaign: 'Referral Follow-ups', replyCount: 0 },
    { id: 'om3', recipientId: 'c3', recipientName: 'Emily Rodriguez', recipientEmail: 'emily@scalewise.com', subject: 'Your AI Workflow Guide is Ready', body: 'Hi Emily, thanks for downloading our guide...', status: 'sent', sentAt: daysAgo(0), campaign: 'Lead Magnet Follow-up', replyCount: 0 },
    { id: 'om4', recipientId: 'c9', recipientName: 'Nina Volkov', recipientEmail: 'nina@apexstream.com', subject: 'Chatbot Automation Case Study', body: 'Hi Nina, I saw your interest in chatbot solutions...', status: 'queued', scheduledAt: daysFromNow(1), campaign: 'Q1 LinkedIn Outreach', replyCount: 0 },
    { id: 'om5', recipientId: 'c10', recipientName: 'Carlos Mendez', recipientEmail: 'carlos@pulsedata.io', subject: 'Data Pipeline Automation', body: 'Hi Carlos, Olivia Martinez suggested we connect...', status: 'queued', scheduledAt: daysFromNow(2), campaign: 'Referral Follow-ups', replyCount: 0 },
    { id: 'om6', recipientId: 'c7', recipientName: 'Aisha Patel', recipientEmail: 'aisha@zenith.ai', subject: 'Workflow Optimization for Zenith AI', body: 'Hi Aisha, as VP of Operations you know the impact...', status: 'replied', sentAt: daysAgo(5), openedAt: daysAgo(4), repliedAt: daysAgo(3), campaign: 'Q1 LinkedIn Outreach', replyCount: 3 },
];

// --- Mock Contacts ---
export const mockContacts: Contact[] = [
    { id: 'c1', name: 'Sarah Chen', email: 'sarah@techflow.io', phone: '+1-555-0101', company: 'TechFlow Inc', role: 'CTO', linkedinUrl: 'https://linkedin.com/in/sarahchen', tags: ['decision-maker', 'tech'], notes: 'Very responsive, prefers email', leadId: 'l1', lastInteraction: daysAgo(1), createdAt: daysAgo(14) },
    { id: 'c2', name: 'Marcus Johnson', email: 'marcus@brightpath.co', company: 'BrightPath Solutions', role: 'CEO', linkedinUrl: 'https://linkedin.com/in/marcusj', tags: ['decision-maker', 'referral'], notes: 'Referred by David Park', leadId: 'l2', lastInteraction: daysAgo(2), createdAt: daysAgo(21) },
    { id: 'c3', name: 'Emily Rodriguez', email: 'emily@scalewise.com', phone: '+1-555-0103', company: 'ScaleWise', role: 'Head of Growth', tags: ['marketing', 'inbound'], notes: 'Downloaded lead magnet', leadId: 'l3', lastInteraction: daysAgo(0), createdAt: daysAgo(1) },
    { id: 'c4', name: 'James Liu', email: 'james@novahub.io', company: 'NovaHub', role: 'VP Engineering', linkedinUrl: 'https://linkedin.com/in/jamesliu', tags: ['tech', 'enterprise'], notes: 'Responded to cold outreach', leadId: 'l4', lastInteraction: daysAgo(3), createdAt: daysAgo(7) },
    { id: 'c5', name: 'Olivia Martinez', email: 'olivia@greenleaf.co', phone: '+1-555-0105', company: 'GreenLeaf Digital', role: 'COO', linkedinUrl: 'https://linkedin.com/in/oliviam', tags: ['decision-maker', 'enterprise', 'event'], notes: 'Met at AI Summit', leadId: 'l5', lastInteraction: daysAgo(1), createdAt: daysAgo(30) },
    { id: 'c6', name: 'Daniel Kim', email: 'daniel@cloudnine.dev', company: 'CloudNine Dev', role: 'Founder', tags: ['decision-maker', 'client'], notes: 'Active client, very happy with service', leadId: 'l6', lastInteraction: daysAgo(5), createdAt: daysAgo(45) },
    { id: 'c7', name: 'Aisha Patel', email: 'aisha@zenith.ai', company: 'Zenith AI', role: 'VP Operations', linkedinUrl: 'https://linkedin.com/in/aishap', tags: ['decision-maker', 'ai'], notes: 'Asking about workflow optimization', leadId: 'l7', lastInteraction: daysAgo(2), createdAt: daysAgo(10) },
    { id: 'c8', name: 'David Park', email: 'david@referralpro.com', company: 'ReferralPro', role: 'CEO', tags: ['referrer', 'network'], notes: 'Great referral source — sent Marcus our way', lastInteraction: daysAgo(20), createdAt: daysAgo(90) },
];

// --- Mock Clients ---
export const mockClients: Client[] = [
    { id: 'cl1', companyName: 'CloudNine Dev', contactId: 'c6', status: 'active', contractValue: 120000, mrr: 10000, startDate: daysAgo(180), billingCycle: 'monthly', nextInvoiceDate: daysFromNow(6), projects: ['CRM Automation', 'Email Sequences'], notes: 'Flagship client, expanding scope' },
    { id: 'cl2', companyName: 'TechFlow Inc', contactId: 'c1', status: 'onboarding', contractValue: 90000, mrr: 7500, startDate: daysAgo(14), billingCycle: 'monthly', nextInvoiceDate: daysFromNow(16), projects: ['Sales Pipeline AI'], notes: 'Setting up initial integrations' },
    { id: 'cl3', companyName: 'RapidScale Labs', contactId: 'c8', status: 'active', contractValue: 72000, mrr: 6000, startDate: daysAgo(120), billingCycle: 'monthly', nextInvoiceDate: daysFromNow(10), projects: ['Lead Gen Automation'], notes: 'Happy client, stable engagement' },
    { id: 'cl4', companyName: 'DataBridge Corp', contactId: 'c4', status: 'at-risk', contractValue: 48000, mrr: 4000, startDate: daysAgo(90), billingCycle: 'quarterly', nextInvoiceDate: daysFromNow(3), projects: ['Data Pipeline'], notes: 'Unhappy with delivery timeline. Schedule urgent review.' },
    { id: 'cl5', companyName: 'SynergyAI', contactId: 'c7', status: 'active', contractValue: 156000, mrr: 13000, startDate: daysAgo(240), billingCycle: 'monthly', nextInvoiceDate: daysFromNow(12), projects: ['Full Automation Suite', 'Chatbot', 'Analytics'], notes: 'Largest client. Annual renewal in Q2.' },
];

// --- Analytics Helpers ---
export const getLeadsByDate = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
        const date = daysAgo(i);
        data.push({
            date: date.toISOString().split('T')[0],
            leads: Math.floor(Math.random() * 8) + 1,
            qualified: Math.floor(Math.random() * 4),
        });
    }
    return data;
};

export const getFunnelMetrics = () => [
    { stage: 'New', count: 45, color: '#3B82F6' },
    { stage: 'Contacted', count: 32, color: '#8B5CF6' },
    { stage: 'Qualified', count: 18, color: '#F59E0B' },
    { stage: 'Proposal', count: 12, color: '#EC4899' },
    { stage: 'Negotiation', count: 6, color: '#F97316' },
    { stage: 'Won', count: 4, color: '#22C55E' },
];

export const getRevenueByMonth = () => [
    { month: 'Sep', revenue: 28000 },
    { month: 'Oct', revenue: 32000 },
    { month: 'Nov', revenue: 35000 },
    { month: 'Dec', revenue: 38500 },
    { month: 'Jan', revenue: 40500 },
    { month: 'Feb', revenue: 40500 },
];
