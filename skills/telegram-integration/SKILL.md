---
name: telegram-integration
description: Bot API patterns, webhook handling, and user interaction flows for Telegram.
---

# Telegram Integration Skill

This skill covers the Telegram bot integration that serves as a primary channel for agent interactions.

## Architecture
- **n8n Workflows**: Handle incoming messages and route to appropriate handlers.
- **Webhook**: Telegram sends updates to n8n webhook endpoints.
- **Bot Token**: Stored securely in environment variables.

## Key Flows

### Lead Submission via Telegram
1. Agent sends lead data through bot.
2. n8n workflow validates and processes the data.
3. Lead is created in Supabase.
4. Confirmation sent back to agent.

### Notifications
- Lead status updates sent to agents.
- Commission notifications.
- System alerts and reminders.

## Message Formatting
- Use Markdown for formatted messages.
- Keep messages concise and actionable.
- Include relevant data (lead name, status, amount).

## Security
- Validate webhook signatures.
- Verify user identity before processing sensitive commands.
- Rate limit to prevent abuse.

## Error Handling
- Graceful error messages to users.
- Log errors for debugging.
- Retry logic for transient failures.

## Best Practices
- Acknowledge receipt of messages quickly.
- Provide clear instructions for user commands.
- Support both English and Indonesian responses.
