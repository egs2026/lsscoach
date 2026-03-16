---
name: supabase-management
description: Instructions for managing Supabase database, authentication, and storage for the BFAAS project.
---

# Supabase Management Skill

This skill provides guidelines for interacting with Supabase resources.

## Database Management
- **Migrations**: All schema changes must be done through SQL migrations. Refer to `SUPABASE_SETUP.md` for the initial schema.
- **SQL Best Practices**: Ensure Row Level Security (RLS) is enabled for all new tables.
- **Data Integrity**: Use foreign key constraints and appropriate data types.

## Authentication
- The project uses Supabase Auth.
- Use the `lib/supabase.ts` client for all client-side authentication logic.
- Admin features should verify roles (e.g., `super_admin`) as defined in the `profiles` table.

## Edge Functions
- Edge functions are located in the `supabase/functions` directory (if applicable).
- Always test functions locally using the Supabase CLI before deploying.

## Useful Resources
- Refer to [SUPABASE_SETUP.md](file:///c:/Users/kelik/OneDrive/AI%20Coach/Project/BJS/BFAAS/SUPABASE_SETUP.md) for environment configuration.
- Check `src/services/` for existing database service patterns.
