---
name: role-permissions
description: RBAC patterns, role hierarchy, and permission checks for the multi-role system.
---

# Role & Permissions Skill

This skill defines the role-based access control (RBAC) system for BFAAS.

## Role Hierarchy
1. **Super Admin**: Full system access, manages all users and settings.
2. **Admin**: Manages agents, leads, commissions within their scope.
3. **Manager**: Oversees a team of agents, views team performance.
4. **Supervisor**: Monitors agent activities, provides guidance.
5. **Agent**: Submits leads, views own performance and commissions.

## Permission Matrix

| Feature | Super Admin | Admin | Manager | Supervisor | Agent |
|---------|-------------|-------|---------|------------|-------|
| Role Management | ✓ | ✗ | ✗ | ✗ | ✗ |
| User Management | ✓ | ✓ | ✗ | ✗ | ✗ |
| Commission Settings | ✓ | ✓ | ✗ | ✗ | ✗ |
| View All Agents | ✓ | ✓ | ✓ | ✓ | ✗ |
| View Own Data | ✓ | ✓ | ✓ | ✓ | ✓ |
| Submit Leads | ✓ | ✓ | ✓ | ✓ | ✓ |

## Implementation Patterns

### Frontend Route Protection
- Use `ProtectedRoute` component with role checks.
- Redirect unauthorized users to appropriate pages.

### Backend RLS Policies
- Supabase RLS enforces data access at the database level.
- Each table has policies based on user role.

### Service Layer Checks
- Validate permissions before performing sensitive operations.
- Return appropriate error messages for unauthorized access.

## Database
- `profiles.role`: Stores user role.
- Role values: `super_admin`, `admin`, `manager`, `supervisor`, `agent`.

## Best Practices
- Always check permissions on both frontend and backend.
- Use consistent role names across the codebase.
- Log role changes for audit purposes.
