---
name: ai-features
description: Guidelines for managing AI-driven features like Chat, RAG, and lead processing.
---

# AI Features Skill

This skill provides context for the AI capabilities of the BFAAS platform.

## Core AI Components
- **AI Chat**: Uses RAG (Retrieval Augmented Generation) to answer queries based on Bank Jateng Syariah knowledge.
- **Knowledge Base**: Processed documents and FAQ used for similarity search.
- **LLM Integration**: Primarily uses OpenRouter or dedicated Edge Functions.

## Implementation Guidelines
- **Prompts**: Keep prompts versioned and clear.
- **Data Privacy**: Ensure PII (Personally Identifiable Information) is masked or excluded before sending data to external LLMs.
- **Reliability**: Use fallback mechanisms if the AI service is unavailable.

## Monitoring
- Monitor AI usage and latency.
- Log AI responses for quality assessment and user feedback loops.
