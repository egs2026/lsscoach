---
name: deployment-ops
description: CI/CD pipelines, environment configuration, and monitoring for production reliability.
---

# Deployment & Operations Skill

This skill covers deployment, CI/CD, and operational practices for BFAAS.

## Environments
- **Development**: Local development with `npm run dev`.
- **Staging**: Pre-production testing environment.
- **Production**: Live environment for end users.

## Environment Configuration
- Use `.env` files for environment-specific variables.
- Never commit `.env` to version control.
- Use `.env.example` as a template.

### Key Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_N8N_WEBHOOK_URL=
```

## Build Process
```bash
npm run build    # Production build
npm run preview  # Preview production build locally
```

## Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] n8n workflows deployed and activated
- [ ] Edge functions deployed
- [ ] SSL certificates valid

## CI/CD Pipeline (Recommended)
1. **Lint**: Check code quality.
2. **Test**: Run unit and integration tests.
3. **Build**: Create production bundle.
4. **Deploy**: Push to hosting platform.

## Monitoring
- Monitor application errors and exceptions.
- Track API response times.
- Set up alerts for critical failures.
- Review Supabase logs regularly.

## Rollback Strategy
- Maintain previous build artifacts.
- Document rollback procedures.
- Test rollback process periodically.

## Best Practices
- Use feature flags for gradual rollouts.
- Document deployment procedures.
- Perform deployments during low-traffic periods.
- Notify team before and after deployments.
