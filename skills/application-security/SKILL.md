---
name: application-security
description: Technical security implementation, covering OWASP Top 10, input validation, headers, and dependency hardening.
---

# Application Security Skill

This skill focuses on the **technical implementation** of security measures to protect the BFAAS application from attacks, complementing the policy-focused `security-compliance` skill.

## OWASP Top 10 Mitigation

### 1. Injection
- **SQL Injection**: Prevented by using Supabase client libraries (which use parameterized queries). Avoid raw `rpc()` with un-sanitized string concatenation.
- **Command Injection**: Never use user input in `exec()` commands (backend).

### 2. Broken Authentication
- Rely exclusively on Supabase Auth.
- Enforce MFA (Multi-Factor Authentication) for Admin/Manager roles.
- Do not store session tokens in `localStorage` if XSS is a risk; prefer `httpOnly` cookies or Supabase's secure default helpers.

### 3. Sensitive Data Exposure
- See `security-compliance` for PII.
- **Frontend**: Ensure no sensitive keys (`SERVICE_ROLE_KEY`) are bundled in the client code.

### 4. XML External Entities (XXE)
- If parsing XML in n8n or Edge Functions, disable external entity resolution.

### 5. Broken Access Control
- Enforce **Role-Based Access Control (RBAC)** at the API/Database level (RLS), not just the frontend UI.
- Verify object ownership before update/delete actions.

### 6. Security Misconfiguration
- Disable default accounts/passwords.
- Remove debug features/logs in production.

### 7. Cross-Site Scripting (XSS)
- React protects against most XSS by default.
- **Danger Zone**: Avoid `dangerouslySetInnerHTML`. If necessary, use `dompurify` to sanitize content first.
- Validate all URL inputs to prevent `javascript:` protocol attacks.

## Input Validation
- **Schema Validation**: Use **Zod** for all form inputs and API request bodies.
- **Strict Typing**: TypeScript helps prevent type confusion attacks.
- **Sanitization**: Trim whitespace and strip aggressive characters from free-text fields where appropriate.

## Secure Headers (HTTP)
- **Content Security Policy (CSP)**: Restrict sources for scripts, styles, and images.
- **HSTS**: Enforce HTTPS.
- **X-content-type-options**: `nosniff`.
- **Referrer-Policy**: `strict-origin-when-cross-origin`.

## Dependency Management
- Run `npm audit` regularly.
- Update dependencies to patch known vulnerabilities.
- Be cautious with "suspicious" or unmaintained packages.

## Rate Limiting
- Implement rate limiting on Edge Functions and API endpoints to prevent Brute Force and DDoS.
- Use Supabase's built-in rate limiting where available.
