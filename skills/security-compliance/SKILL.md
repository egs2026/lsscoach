---
name: security-compliance
description: PII handling, RLS policies, API key management, and security best practices for banking data.
---

# Security & Compliance Skill

This skill ensures the BFAAS project meets security standards for handling sensitive banking and personal data.

## Data Protection

### PII (Personally Identifiable Information)
- **NIK (National ID)**: Always mask when displaying (show only last 4 digits).
- **Phone Numbers**: Partial masking in logs and displays.
- **Addresses**: Never log full addresses.

### Data at Rest
- Use Supabase's built-in encryption.
- Consider additional encryption for highly sensitive fields.

### Data in Transit
- All API calls must use HTTPS.
- Never transmit sensitive data in URL parameters.

## Row Level Security (RLS)
- **Mandatory**: All tables must have RLS enabled.
- Agents should only see their own data.
- Admins/Managers can see data within their scope.
- Super Admins have full access.

## API Key Management
- Store all keys in `.env` (never commit to git).
- Use Supabase secrets for Edge Functions.
- Rotate keys periodically.

## Authentication Security
- Enforce strong password policies.
- Implement session timeout.
- Log authentication events for auditing.

## Audit Logging
- Log all sensitive operations (role changes, commission adjustments).
- Include timestamp, user ID, and action details.
- Retain logs for compliance purposes.

## Compliance Checklist
- [ ] RLS enabled on all public tables
- [ ] PII masking implemented
- [ ] API keys secured in environment variables
- [ ] Audit logging for sensitive operations
- [ ] HTTPS enforced
