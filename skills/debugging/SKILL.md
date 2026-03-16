---
name: debugging
description: Strategies for troubleshooting frontend, backend, and orchestration issues in BFAAS.
---

# Debugging Skill

This skill outlines the standard procedures for identifying and resolving issues across the BFAAS stack.

## Frontend (React/Vite)
- **Console Logging**: Use clear labels in logs (e.g., `console.log('[Auth] User session:', session)`).
- **Network Tab**: Always inspect HTTP 4xx/5xx errors. Check the "Response" tab for specific Supabase error messages.
- **React DevTools**: Verify component props and state. Check context providers if global state seems missing.
- **Common Issues**:
    - **CORS Errors**: Usually mean a backend config issue or missing headers in Edge Functions.
    - **Auth persistence**: Check LocalStorage/Cookies if session is lost on refresh.

## Backend (Supabase)
- **Postgres Logs**: Check database logs for SQL errors or RLS policy violations.
- **RLS Debugging**: If a query returns empty rows unexpectedly, it's 99% an RLS policy issue. Temporarily disable RLS or use `service_role` key (carefully!) to confirm.
- **Edge Functions**:
    - Run locally with `supabase functions serve`.
    - Check the `deno` logs in the Supabase dashboard.
    - Ensure environment variables are set in the function's scope.

## Orchestration (n8n)
- **Execution History**: The first place to look. Identify the exact node that failed.
- **Data Flooding**: Check if a node is receiving too many items (e.g., an unintentional loop).
- **Webhook Debugging**: Use tools like `webhook.site` to verify what payloads are actually being sent to n8n.
- **Authentication**: Verify Bearer tokens or API keys are correctly passed in headers.

## Telegram Bot
- **Silent Failures**: If the bot doesn't reply, check n8n execution logs first.
- **JSON Structure**: Telegram API is strict. Validate your JSON payloads for messages.

## Systematic Approach
1. **Isolate**: Can you reproduce the bug with a minimal example?
2. **Trace**: Follow the data flow from UI -> Backend -> DB/Service -> UI.
3. **Verify**: Check assumptions (e.g., "Is the user actually logged in?").
4. **Fix & Test**: Apply the fix and run regression tests.
