---
name: git-standards
description: Version control best practices, branding strategies, and commit conventions.
---

# Git Standards Skill

This skill defines the version control practices for the BFAAS project to ensure history cleanliness and collaboration efficiency.

## Branching Strategy

We follow a simplified Git Flow.

- **`main`**: Production-ready code. Protected branch.
- **`develop`** (optional): Integration branch for features.
- **Feature Branches**: `feat/description-of-feature`
- **Bug Fixes**: `fix/description-of-issue`
- **Chores/Refactors**: `chore/description`

### Branch Naming Convention
- Use kebab-case: `feat/user-login`, `fix/commission-calc`
- Keep it short and descriptive.

## Commit Messages

We strictly follow **Conventional Commits** (https://www.conventionalcommits.org/).

### Format
```
<type>(<scope>): <subject>
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

### Examples
- `feat(auth): add google oauth login`
- `fix(leads): correct status transition logic`
- `docs(readme): update installation steps`

## Pull Requests (PRs)

- **Title**: Use the same conventional commit format.
- **Description**: Explain *what* changed and *why*.
- **Review**: At least one approval required before merging (if working in a team).

## .gitignore

Ensure sensitive files and build artifacts are ignored.
- `.env` (Never commit credentials!)
- `node_modules/`
- `dist/`

## Tagging
- Use semantic versioning for tags (e.g., `v1.0.0`, `v1.1.0`).
