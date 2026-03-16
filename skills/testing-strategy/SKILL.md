---
name: testing-strategy
description: Guidelines for unit, integration, and E2E testing to ensure code quality and prevent regressions.
---

# Testing Strategy Skill

This skill defines the testing approach for the BFAAS project.

## Testing Layers

### Unit Tests
- Test individual functions and components in isolation.
- Use mocking for external dependencies (Supabase, APIs).
- Focus on business logic in `src/services/` and utility functions.

### Integration Tests
- Test interactions between components.
- Verify service layer integrations with Supabase.
- Test React component compositions.

### End-to-End (E2E) Tests
- Test complete user flows (login, lead submission, commission viewing).
- Use browser automation tools.
- Run against a staging environment when possible.

## Best Practices
- **Test Coverage**: Aim for meaningful coverage on critical paths (auth, commissions, leads).
- **Test Naming**: Use descriptive names that explain the scenario being tested.
- **Test Data**: Use factories or fixtures for consistent test data.
- **CI Integration**: Tests should run automatically on pull requests.

## Running Tests
```bash
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests (if configured)
```

## What to Test
- Authentication flows
- Commission calculations
- Lead status transitions
- Role-based access control
- Form validations
