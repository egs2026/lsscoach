---
name: n8n-management
description: Specialized instructions and tools for managing n8n workflows within the BFAAS project.
---

# n8n Management Skill

This skill provides the agent with the necessary context and instructions to effectively manage, deploy, and monitor n8n workflows that serve as the orchestration layer for the BFAAS project.

## Project Context
The BFAAS project uses n8n for:
- Lead status notifications.
- Lead submission via Telegram.
- AI Chat integration.
- Document ingestion.
- Monitoring hooks.

## Key Instructions
1. **Workflow Structure**: All n8n workflows should follow the standard project format, including error handling and retry logic.
2. **Environment Variables**: Use the `.env` file for all sensitive credentials (API keys, bot tokens). Never hardcode secrets.
3. **Naming Conventions**: Use descriptive names for nodes and workflows to ensure maintainability.
4. **Exporting Workflows**: When creating or modifying workflows, ensure they are exported as JSON files in the `docs/n8n` directory for version control.

## Useful Commands
- `npm run dev`: Start the development server (useful if n8n is integrated into the local dev flow).
- Check `SUPABASE_SETUP.md` for database-related workflow dependencies.
