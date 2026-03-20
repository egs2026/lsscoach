---
name: lead-management
description: Lead pipeline stages, status transitions, and notification workflows.
---

# Lead Management Skill

This skill covers the lead lifecycle and pipeline management in BFAAS.

## Lead Pipeline Stages

### Status Flow
```
New → Contacted → Qualified → Proposal → Negotiation → Won/Lost
```

### Status Definitions
- **New**: Lead just submitted, awaiting first contact.
- **Contacted**: Initial contact made with the prospect.
- **Qualified**: Prospect meets criteria and shows interest.
- **Proposal**: Product/service proposal presented.
- **Negotiation**: Terms being discussed.
- **Won**: Deal closed successfully.
- **Lost**: Deal did not close.

## Lead Submission
- Via web application form.
- Via Telegram bot.
- Required fields: name, phone, product interest.
- Optional fields: address, notes, preferred contact time.

## Notifications
- Agent notified when lead is assigned.
- Manager notified of status changes.
- Reminders for follow-up actions.

## Data Structure
```typescript
interface Lead {
  id: string;
  agent_id: string;
  customer_name: string;
  phone: string;
  product_interest: string;
  status: LeadStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
```

## UI Components
- `src/features/leads/`: Lead-related components.
- Lead list with filtering and search.
- Lead detail view with status history.

## Best Practices
- Log all status transitions.
- Validate status transitions (prevent invalid jumps).
- Send timely notifications for urgent leads.
- Track lead source for analytics.
