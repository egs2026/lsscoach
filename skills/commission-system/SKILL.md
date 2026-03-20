---
name: commission-system
description: Rules for calculating, adjusting, and disbursing agent commissions.
---

# Commission System Skill

This skill defines the commission management logic for the BFAAS project.

## Commission Structure

### Global Settings
- Base commission rates defined at the system level.
- Configured by Super Admin or Admin.
- Applied to all agents by default.

### Per-Agent Overrides
- Individual agents can have custom commission rates.
- Stored in `commission_override` fields on the agent record.
- Takes precedence over global settings.

## Calculation Logic
1. Determine applicable rate (per-agent override or global).
2. Calculate commission based on product value and rate.
3. Apply any adjustments or bonuses.
4. Record in commission ledger.

## Commission States
- **Pending**: Calculated but not yet approved.
- **Approved**: Verified and ready for disbursement.
- **Paid**: Disbursed to the agent.
- **Clawback**: Reversed due to cancellation or error.

## Clawback Rules
- Triggered when a lead is cancelled after commission was paid.
- Full or partial clawback based on business rules.
- Audited and logged for compliance.

## UI Components
- `AgentCommissionModal.tsx`: Per-agent commission adjustment.
- Commission breakdown in Agent Dashboard.
- Disbursement overview in Management Dashboard.

## Database Tables
- `commissions`: Commission records.
- `agents.commission_override_*`: Per-agent override fields.

## Best Practices
- Always validate commission calculations.
- Log all commission changes for audit trail.
- Notify agents of commission status changes.
