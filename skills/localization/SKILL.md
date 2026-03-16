---
name: localization
description: i18n patterns, translation key conventions, and bilingual (EN/ID) support.
---

# Localization Skill

This skill defines the internationalization (i18n) approach for BFAAS, supporting English and Indonesian.

## Supported Languages
- **English (en)**: Default language.
- **Indonesian (id)**: Primary user language.

## Translation System
- Uses key-based translation with a `t` object.
- Translation files organized by feature/section.
- Consistent key naming conventions.

## Key Naming Convention
```
section.subsection.element
```

### Examples
```typescript
t.common.save        // "Save" / "Simpan"
t.auth.login         // "Login" / "Masuk"
t.leads.status.new   // "New" / "Baru"
```

## Implementation Pattern
```typescript
// ❌ Don't use inline conditionals
{language === 'id' ? 'Simpan' : 'Save'}

// ✓ Use translation keys
{t.common.save}
```

## Adding New Translations
1. Add key to English translation file.
2. Add corresponding key to Indonesian translation file.
3. Use the key in the component.

## UI Language Switcher
- Located in the application header.
- Persists user preference.
- Applies immediately without page reload.

## Best Practices
- Never hardcode text in components.
- Use descriptive, hierarchical keys.
- Keep translations consistent across similar elements.
- Test both languages during development.
- Handle pluralization appropriately.

## File Locations
- Translation definitions in `src/lib/` or dedicated i18n folder.
- Language context provider in hooks.
