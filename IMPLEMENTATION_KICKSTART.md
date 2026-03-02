# LCL Portal - Implementation Kickstart

## Project Overview
Internal business command center for LCL Automation (AI automation agency). Dark-themed Next.js application with comprehensive business management features.

---

## Design System Specifications

### Colors
```
Background:      #000000 (black)
Cards:           #111111 (dark gray)
Accent:          #730404 (deep red)
Text Primary:    #FFFFFF (white)
Text Secondary:  #A3A3A3 (gray)
Text Muted:      #666666 (dark gray)

Status Colors:
- Success:       #22C55E (green)
- Warning:       #F59E0B (amber)
- Error:         #EF4444 (red)
- Info:          #3B82F6 (blue)
```

### Typography
- **Headings/Body**: Geist Sans (default Next.js font)
- **Stats/Labels**: Geist Mono (monospace)

### Design Patterns
- Cards: `rounded-xl`, subtle red border glow on hover
- Animations: Subtle, smooth, professional (no flashy transitions)
- Responsive: Mobile-first with sidebar collapse at <768px

---

## File Structure

```
/app
  layout.tsx                    # Root layout with sidebar
  page.tsx                      # Dashboard
  /leads
    page.tsx                    # Leads table view
  /tasks
    page.tsx                    # Tasks list/board view
  /pipeline
    page.tsx                    # LMLFM pipeline visualization
  /outreach
    page.tsx                    # Message tracking
  /contacts
    page.tsx                    # People database
  /clients
    page.tsx                    # Active clients
  /analytics
    page.tsx                    # Charts and metrics
  /settings
    page.tsx                    # Configuration

/components
  /layout
    sidebar.tsx                 # Main navigation sidebar
    header.tsx                  # Top header (mobile menu, user profile)
    main-layout.tsx             # Content wrapper with max-width
  /dashboard
    stats-card.tsx              # Reusable metric card
    lead-funnel-chart.tsx       # Funnel visualization
    pipeline-status.tsx         # Pipeline overview widget
    today-tasks.tsx             # Task list widget
    recent-outreach.tsx         # Recent activity widget
  /leads
    leads-table.tsx             # Main data table
    lead-filters.tsx            # Filter controls
    lead-row.tsx                # Table row component
    add-lead-dialog.tsx         # Create/edit modal
  /tasks
    task-list.tsx               # List view
    task-board.tsx              # Kanban board view
    task-card.tsx               # Individual task
    task-filters.tsx            # Filter/sort controls
    add-task-dialog.tsx         # Create/edit modal
  /pipeline
    pipeline-visual.tsx         # LMLFM pipeline stages
    new-run-form.tsx            # Start new pipeline run
    execution-history.tsx       # Past runs table
    run-details-dialog.tsx      # Run details modal
  /outreach
    message-queue.tsx           # Queue tab content
    active-messages.tsx         # Active tab content
    message-replies.tsx         # Replies tab content
    message-composer.tsx        # Send message form
  /contacts
    contacts-table.tsx          # People database table
    contact-card.tsx            # Contact detail view
    add-contact-dialog.tsx      # Create/edit modal
  /clients
    clients-table.tsx           # Active clients table
    client-card.tsx             # Client detail card
    revenue-chart.tsx           # Revenue visualization
    add-client-dialog.tsx       # Create/edit modal
  /analytics
    lead-volume-chart.tsx       # Leads over time
    funnel-chart.tsx            # Conversion funnel
    revenue-chart.tsx           # Revenue over time
    date-range-picker.tsx       # Date filter control
  /settings
    api-keys-section.tsx        # API configuration
    n8n-connection.tsx          # n8n integration
    profile-section.tsx         # User profile
  /ui
    [shadcn components]         # Already installed

/lib
  mock-data.ts                  # Sample data for development
  utils.ts                      # Utility functions (already exists)
  constants.ts                  # App constants
  types.ts                      # TypeScript interfaces
```

---

## Component Hierarchy & Detailed Breakdown

### 1. Dashboard (/)
**Purpose**: Overview of key metrics, recent activity, and action items.

**Components**:
- `StatsCard` (4 instances)
  - Props: `title`, `value`, `change`, `icon`, `trend`
  - Shows: Total leads, active clients, tasks due, revenue
  - Includes: Icon, large number, percentage change with color

- `LeadFunnelChart`
  - Uses: Recharts BarChart/FunnelChart
  - Data: Lead stages with counts
  - Interactive: Click to navigate to Leads page with filter

- `PipelineStatus`
  - Shows: Current pipeline runs (LMLFM stages)
  - Data: Run ID, status, progress, started date
  - Actions: View details button

- `TodayTasks`
  - Shows: 5-8 upcoming/overdue tasks
  - Data: Task name, priority, due time, assignee
  - Actions: Complete checkbox, navigate to Tasks

- `RecentOutreach`
  - Shows: Last 10 outreach messages
  - Data: Contact name, message snippet, status, timestamp
  - Actions: View conversation

**Layout**:
```
[Stats Cards Grid: 4 columns]
[Row 1: LeadFunnelChart (60%) | PipelineStatus (40%)]
[Row 2: TodayTasks (50%) | RecentOutreach (50%)]
```

**Estimated Tokens**: ~12,000

---

### 2. Leads (/leads)
**Purpose**: Comprehensive lead management with filtering, search, and status tracking.

**Components**:
- `LeadsTable`
  - Columns: Name, Company, Status, Source, Value, Last Contact, Actions
  - Features: Sort, pagination, row selection
  - Uses: shadcn Table component

- `LeadFilters`
  - Filters: Status, Source, Date range, Value range
  - Search: Real-time text search
  - Actions: Clear filters, export

- `AddLeadDialog`
  - Form fields: Name, email, company, phone, status, source, value, notes
  - Validation: Required fields, email format
  - Actions: Save, cancel

**Data Structure**:
```typescript
type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  source: 'website' | 'referral' | 'linkedin' | 'cold-outreach' | 'event';
  value: number;
  lastContact: Date;
  notes: string;
  createdAt: Date;
}
```

**Layout**:
```
[Header: Title + Add Button]
[Filter Bar]
[Data Table]
[Pagination Controls]
```

**Estimated Tokens**: ~10,000

---

### 3. Tasks (/tasks)
**Purpose**: Task management with list and board views.

**Components**:
- `TaskList`
  - Row format: Checkbox, title, priority badge, due date, assignee avatar
  - Grouping: By status or date
  - Actions: Complete, edit, delete

- `TaskBoard`
  - Columns: To Do, In Progress, Review, Done
  - Drag-and-drop: Move between columns
  - Card format: Title, priority, assignee, due date

- `TaskFilters`
  - Filters: Priority, status, assignee, due date
  - View toggle: List/Board
  - Actions: Add task, bulk actions

- `AddTaskDialog`
  - Fields: Title, description, priority, status, assignee, due date, category
  - Validation: Required title and due date

**Data Structure**:
```typescript
type Task = {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  category: 'lead-follow-up' | 'client-work' | 'internal' | 'pipeline';
  assignee: string;
  dueDate: Date;
  createdAt: Date;
  completedAt?: Date;
}
```

**Estimated Tokens**: ~14,000

---

### 4. Pipeline (/pipeline)
**Purpose**: LMLFM (Lead Magnet → Lead → Follow-up → Meeting) pipeline visualization and execution.

**Components**:
- `PipelineVisual`
  - Visual: 4-stage horizontal flow diagram
  - Per stage: Count, success rate, average time
  - Interactive: Click stage to see leads in that stage

- `NewRunForm`
  - Fields: Lead selection, campaign name, start date
  - Configuration: Message templates, timing settings
  - Actions: Start run, save as draft

- `ExecutionHistory`
  - Table: Run ID, campaign, started, completed, leads, status
  - Filters: Date range, status
  - Actions: View details, stop run, restart

- `RunDetailsDialog`
  - Shows: Timeline of activities, lead progression, metrics
  - Data: Stage transitions, message sent/opened/replied

**Data Structure**:
```typescript
type PipelineRun = {
  id: string;
  campaignName: string;
  status: 'draft' | 'running' | 'paused' | 'completed' | 'failed';
  leadIds: string[];
  startedAt: Date;
  completedAt?: Date;
  metrics: {
    leadMagnetSent: number;
    leadsGenerated: number;
    followUpsSent: number;
    meetingsBooked: number;
  };
}
```

**Estimated Tokens**: ~15,000

---

### 5. Outreach (/outreach)
**Purpose**: Message tracking across queue, active, and replies states.

**Components**:
- `MessageQueue`
  - List: Scheduled messages awaiting send
  - Data: Recipient, message preview, scheduled time, campaign
  - Actions: Edit, delete, send now, pause

- `ActiveMessages`
  - List: Sent messages awaiting reply
  - Data: Recipient, sent time, opened status, campaign
  - Actions: View conversation, follow up

- `MessageReplies`
  - List: Messages with replies
  - Data: Recipient, last reply time, reply snippet
  - Actions: View conversation, mark as handled

- `MessageComposer`
  - Form: To, subject, body, schedule time
  - Features: Template selection, variable insertion
  - Actions: Send now, schedule, save draft

**Data Structure**:
```typescript
type OutreachMessage = {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  status: 'queued' | 'sent' | 'opened' | 'replied' | 'bounced';
  scheduledAt?: Date;
  sentAt?: Date;
  openedAt?: Date;
  repliedAt?: Date;
  campaign: string;
  replyCount: number;
}
```

**Estimated Tokens**: ~13,000

---

### 6. Contacts (/contacts)
**Purpose**: People database linked to leads and clients.

**Components**:
- `ContactsTable`
  - Columns: Name, email, company, role, lead status, last interaction, tags
  - Features: Search, filter, sort, bulk actions

- `ContactCard`
  - Sections: Basic info, contact details, related leads, activity history
  - Shows: Social links, notes, tags
  - Actions: Edit, delete, create lead, send message

- `AddContactDialog`
  - Fields: Name, email, phone, company, role, social links, tags, notes

**Data Structure**:
```typescript
type Contact = {
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
}
```

**Estimated Tokens**: ~10,000

---

### 7. Clients (/clients)
**Purpose**: Active client tracking with revenue and project management.

**Components**:
- `ClientsTable`
  - Columns: Company, contact, status, MRR, start date, next invoice, actions
  - Features: Search, filter by status, sort

- `ClientCard`
  - Sections: Company info, primary contact, financials, active projects
  - Charts: Revenue trend (mini chart)
  - Actions: Edit, add project, create invoice

- `RevenueChart`
  - Shows: MRR trend over time by client
  - Interactive: Click to see client details

- `AddClientDialog`
  - Fields: Company, contact, contract value, MRR, start date, billing cycle, notes

**Data Structure**:
```typescript
type Client = {
  id: string;
  companyName: string;
  contactId: string;
  status: 'active' | 'onboarding' | 'at-risk' | 'churned';
  contractValue: number;
  mrr: number;
  startDate: Date;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  nextInvoiceDate: Date;
  projects: string[];
  notes: string;
}
```

**Estimated Tokens**: ~11,000

---

### 8. Analytics (/analytics)
**Purpose**: Charts and metrics for lead volume, funnel, and revenue over time.

**Components**:
- `LeadVolumeChart`
  - Chart: Line/bar chart of leads created per day/week/month
  - Filters: Date range, source, status
  - Shows: Trend line, growth percentage

- `FunnelChart`
  - Chart: Conversion funnel from lead → client
  - Shows: Drop-off rates between stages
  - Interactive: Click stage to see leads

- `RevenueChart`
  - Chart: Revenue over time (MRR, total contract value)
  - Filters: Date range, client
  - Shows: Forecast trend

- `DateRangePicker`
  - Presets: Last 7 days, 30 days, 90 days, year, custom
  - Actions: Apply filter globally

**Estimated Tokens**: ~12,000

---

### 9. Settings (/settings)
**Purpose**: Configuration for API keys, integrations, and user profile.

**Components**:
- `ApiKeysSection`
  - List: API services with masked keys
  - Actions: Add, edit, delete, copy key
  - Services: OpenAI, Anthropic, Make, Zapier

- `N8nConnection`
  - Form: n8n instance URL, API key
  - Status: Connection indicator
  - Actions: Test connection, save, disconnect

- `ProfileSection`
  - Form: Name, email, avatar, timezone, notification preferences
  - Actions: Update profile, change password

**Estimated Tokens**: ~8,000

---

## Shared Components

### Layout Components
- `Sidebar` (~300 lines)
  - Navigation items with icons
  - Active state highlighting (red accent)
  - Collapse/expand toggle
  - Mobile drawer version

- `Header` (~150 lines)
  - Mobile hamburger menu
  - Breadcrumb navigation
  - User avatar dropdown

- `MainLayout` (~100 lines)
  - Max-width container (1400px)
  - Padding (24px)
  - Responsive adjustments

### Estimated Tokens for Shared**: ~6,000

---

## Mock Data Structure

### `/lib/mock-data.ts`
```typescript
export const mockLeads: Lead[] = [ /* 50-100 sample leads */ ];
export const mockTasks: Task[] = [ /* 30-50 sample tasks */ ];
export const mockPipelineRuns: PipelineRun[] = [ /* 10-15 runs */ ];
export const mockOutreachMessages: OutreachMessage[] = [ /* 100+ messages */ ];
export const mockContacts: Contact[] = [ /* 80-120 contacts */ ];
export const mockClients: Client[] = [ /* 15-25 clients */ ];

// Helper functions for analytics
export const getLeadsByDate = () => { /* ... */ };
export const getFunnelMetrics = () => { /* ... */ };
export const getRevenueByMonth = () => { /* ... */ };
```

**Estimated Tokens**: ~5,000

---

## Build Order Checklist

### Phase 1: Foundation (Setup & Layout)
- [x] Install/verify required dependencies (Recharts, date-fns, etc.) ✅ Already in package.json. Note: `npm` not in PATH — run `npm install` when node is available.
- [x] Create type definitions (`/lib/types.ts`) ✅ All entity types (Lead, Task, PipelineRun, OutreachMessage, Contact, Client, NavItem, StatCardData)
- [x] Create constants file (`/lib/constants.ts`) ✅ Nav items, color tokens, status configs, layout dimensions
- [x] Create mock data file (`/lib/mock-data.ts`) ✅ 12 leads, 8 tasks, 5 pipeline runs, 6 outreach msgs, 8 contacts, 5 clients + analytics helpers
- [x] Build layout components:
  - [x] Sidebar with navigation ✅ `/components/layout/sidebar.tsx` — collapsible, mobile drawer, active state with red accent
  - [x] Header with mobile menu ✅ `/components/layout/header.tsx` — dynamic page title, search, notifications, avatar
  - [x] MainLayout wrapper ✅ `/components/layout/main-layout.tsx` — orchestrates sidebar/header, manages collapsed/mobile state
  - [x] Update root layout.tsx ✅ Inter + JetBrains Mono fonts, dark class, MainLayout wrapper
- [x] Configure global styles (dark theme, custom colors) ✅ `globals.css` — dark theme CSS vars, card-glow effect, custom scrollbar, animations. `tailwind.config.ts` — LCL brand colors, font vars
- [x] Test responsive behavior ✅ Code audit confirmed all pages/components use responsive breakpoints. 3 minor grid issues fixed in Phase 11

**Estimated Tokens**: ~10,000

### Phase 2: Dashboard
- [x] StatsCard component ✅ `/components/dashboard/stats-card.tsx` — Reusable metric card with icon, trend badge, gradient accent hover effect, stagger animation
- [x] LeadFunnelChart component ✅ `/components/dashboard/lead-funnel-chart.tsx` — Recharts BarChart with custom tooltip, conversion rate badge, stage summary pills
- [x] PipelineStatus widget ✅ `/components/dashboard/pipeline-status.tsx` — Active pipeline runs with progress bars, status icons, animated pulse for running
- [x] TodayTasks widget ✅ `/components/dashboard/today-tasks.tsx` — Interactive task list with toggle-complete, priority badges, overdue indicators
- [x] RecentOutreach widget ✅ `/components/dashboard/recent-outreach.tsx` — Recent messages sorted by activity, status badges, reply counts, relative timestamps
- [x] Assemble Dashboard page ✅ `/app/page.tsx` — Full dashboard with Stats grid (4-col), Funnel+Pipeline row (60/40), Tasks+Outreach row (50/50), live stats from mock data
- [x] Add animations and hover effects ✅ Staggered fade-in entrance (80ms delay per card), card-glow hover, slide-up-fade, scale-in, shimmer, Recharts hover brightness, pulse-subtle for running status

**Estimated Tokens**: ~12,000

### Phase 3: Leads Management
- [x] LeadsTable component ✅ `/components/leads/leads-table.tsx` — Sortable columns (name, company, status, source, value, last contact), pagination (8/page), status badges with semantic colors, row hover effects with staggered fade-in, dropdown actions menu (edit, email, call, delete), empty state, responsive column visibility
- [x] LeadFilters component ✅ `/components/leads/lead-filters.tsx` — Real-time text search (name, company, email), status dropdown filter with color dots, source dropdown filter, clear-all button, filtered/total count display, card-glow hover
- [x] AddLeadDialog component ✅ `/components/leads/add-lead-dialog.tsx` — Full form with name, email, company, phone, status, source, value ($), notes. Validation (required fields, email format, positive number). Edit mode auto-populates. Simulated async save with loading spinner
- [x] Assemble Leads page ✅ `/app/leads/page.tsx` — Header with Add Lead CTA, 4-stat quick bar (total leads, pipeline value, qualified count, conversion rate), clickable status distribution chips as quick filters, LeadFilters, LeadsTable, AddLeadDialog. Staggered fade-in animations
- [x] Connect mock data ✅ Local React state initialized from `mockLeads` (12 leads). Add/edit mutations update state in real-time. Stats computed from live data via useMemo
- [x] Test filtering and search ✅ Search filters by name/company/email. Status and source dropdowns filter independently. Status chips double as quick-toggle filters. Clear filters button resets all. Pagination resets on filter change. All filters composable (AND logic)

**Estimated Tokens**: ~10,000

### Phase 4: Task Management
- [x] TaskList component ✅ `/components/tasks/task-list.tsx` — Groups tasks by status (To Do, In Progress, Review, Done) with colored group headers and count badges. Uses TaskCard in list variant with staggered fade-in animations, empty state
- [x] TaskBoard component (with drag-drop) ✅ `/components/tasks/task-board.tsx` — 4-column Kanban board with native HTML5 drag-and-drop. Visual feedback on drag (column highlight, opacity, scale transforms). Per-column task count, add button on To Do column, empty column state
- [x] TaskFilters component ✅ `/components/tasks/task-filters.tsx` — Real-time text search (title, description, assignee), priority/status/category dropdown filters, clear-all button, filtered/total count, List/Board view toggle with red accent active state
- [x] AddTaskDialog component ✅ `/components/tasks/add-task-dialog.tsx` — Full form: title, description, priority, status, category, assignee, due date. Validation (required title + due date). Edit mode auto-populates. Simulated async save
- [x] View toggle logic ✅ Integrated in TaskFilters and Tasks page — List/Board toggle persisted in state, seamless switch between TaskList and TaskBoard renderers
- [x] Assemble Tasks page ✅ `/app/tasks/page.tsx` — Header with Add Task CTA, 4-stat quick bar (total, completed, overdue, urgent), clickable status+priority distribution chips as quick filters, TaskFilters, conditional TaskList/TaskBoard, AddTaskDialog. Add/edit/delete/complete mutations on local state. Also added TaskCard (`/components/tasks/task-card.tsx`) and TASK_CATEGORY_CONFIG to constants

**Estimated Tokens**: ~14,000

### Phase 5: Pipeline
- [x] PipelineVisual component
- [x] NewRunForm component
- [x] ExecutionHistory component
- [x] RunDetailsDialog component
- [x] Assemble Pipeline page

**Estimated Tokens**: ~15,000

### Phase 6: Outreach
- [x] MessageQueue component
- [x] ActiveMessages component
- [x] MessageReplies component
- [x] MessageComposer component
- [x] Tab navigation logic
- [x] Assemble Outreach page

**Estimated Tokens**: ~13,000

### Phase 7: Contacts
- [x] ContactsTable component
- [x] ContactCard component
- [x] AddContactDialog component
- [x] Assemble Contacts page

**Estimated Tokens**: ~10,000

### Phase 8: Clients
- [x] ClientsTable component
- [x] ClientCard component
- [x] RevenueChart component
- [x] AddClientDialog component
- [x] Assemble Clients page

**Estimated Tokens**: ~11,000

### Phase 9: Analytics
- [x] LeadVolumeChart component
- [x] FunnelChart component
- [x] RevenueChart component
- [x] DateRangePicker component
- [x] Assemble Analytics page

**Estimated Tokens**: ~12,000

### Phase 10: Settings
- [x] ApiKeysSection component
- [x] N8nConnection component
- [x] ProfileSection component
- [x] Assemble Settings page

**Estimated Tokens**: ~8,000

### Phase 11: Polish & Testing
- [x] Add loading states ✅ Created `loading.tsx` for every route (Dashboard, Leads, Tasks, Pipeline, Outreach, Contacts, Clients, Analytics, Settings) using reusable `PageSkeleton` component with shimmer animation
- [x] Add error states ✅ Created `error.tsx` error boundaries for every route using reusable `PageError` component with retry button. Also added `not-found.tsx` global 404 page
- [x] Add empty states ✅ Verified all list/table components already have comprehensive empty states (LeadsTable, TaskList, TaskBoard, ContactsTable, ClientsTable, MessageQueue, ActiveMessages, MessageReplies, ExecutionHistory, ContactCard, ClientCard)
- [x] Verify all animations ✅ Confirmed: `fadeIn`, `slideUpFade`, `scaleIn`, `shimmer`, `pulse-subtle` keyframes in globals.css. All list items use staggered `animate-fade-in` with animation-delay. Card-glow hover effect on interactive cards. Recharts hover brightness transition
- [x] Test all responsive breakpoints ✅ All pages use responsive grids (`sm:`, `md:`, `lg:`, `xl:`). Fixed 3 minor issues: client-card financials grid, execution-history table header/rows, run-details-dialog metrics grid. Sidebar collapses to mobile drawer at md breakpoint
- [x] Test dark theme consistency ✅ Full audit confirmed zero light-mode leaks. All components use project dark palette (#000/#111/#1a1a1a backgrounds, #fff/#a3a3a3/#666 text, #730404 accent). Scrollbar, tooltips, and overlays all dark-themed
- [x] Optimize performance ✅ Wrapped `TaskCard` with `React.memo` to prevent unnecessary re-renders in lists and board. All list components use `useMemo` for sorted/filtered data. Pagination limits rendered rows
- [x] Final review ✅ All 11 phases complete. Codebase ready for `npm install && npm run dev`

**Estimated Tokens**: ~5,000

---

## Total Estimated Token Usage

| Phase | Tokens |
|-------|--------|
| Phase 1: Foundation | 10,000 |
| Phase 2: Dashboard | 12,000 |
| Phase 3: Leads | 10,000 |
| Phase 4: Tasks | 14,000 |
| Phase 5: Pipeline | 15,000 |
| Phase 6: Outreach | 13,000 |
| Phase 7: Contacts | 10,000 |
| Phase 8: Clients | 11,000 |
| Phase 9: Analytics | 12,000 |
| Phase 10: Settings | 8,000 |
| Phase 11: Polish | 5,000 |
| **TOTAL** | **~120,000** |

---

## Key Technical Decisions

### State Management
- Start with React useState for local component state
- Use URL params for filters/search (Next.js searchParams)
- Consider Zustand if global state becomes complex

### Data Fetching (Future)
- Prepare components for async data
- Use React Suspense boundaries
- Implement optimistic UI updates

### Performance
- Use React.memo for expensive list items
- Implement virtual scrolling for tables with 1000+ rows
- Lazy load chart components
- Optimize image loading

### Accessibility
- All interactive elements keyboard accessible
- ARIA labels on icon buttons
- Focus management in dialogs
- Proper heading hierarchy

---

## Notes & Considerations

1. **Mock Data Realism**: Include realistic company names, email formats, and date ranges to properly test filtering and sorting.

2. **Component Modularity**: Keep each component under 600 lines. If exceeding, extract sub-components.

3. **Chart Responsiveness**: All Recharts components need responsive container and mobile-friendly axis labels.

4. **Dark Theme**: Test all components for text contrast and visibility. Accent red (#730404) should only be used for active states and important CTAs.

5. **Icon Consistency**: Use Lucide React exclusively. Common icons:
   - Users: Users icon
   - Tasks: CheckSquare
   - Pipeline: GitBranch
   - Outreach: MessageSquare
   - Analytics: BarChart3
   - Settings: Settings

6. **Status Badges**: Standardize badge variants across all pages:
   - Success: green background, darker green text
   - Warning: amber background, darker amber text
   - Error: red background, darker red text
   - Info: blue background, darker blue text

7. **Future Supabase Integration**: Structure components to easily swap mock data with Supabase queries. Keep data fetching separate from presentation.

---

## Ready to Build?

This plan provides:
✅ Complete component breakdown
✅ Detailed file structure
✅ Data models
✅ Build order with token estimates
✅ Technical decisions documented

**Total Estimated Build Time**: ~120,000 tokens across 11 phases.

**Recommended Build Strategy**: Build phases 1-3 first to establish foundation, then proceed sequentially. Test thoroughly after each phase before moving to the next.

---

Let me know when you're ready to start Phase 1! 🚀
