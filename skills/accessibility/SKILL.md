---
name: accessibility
description: WCAG compliance guidelines, screen reader support, and inclusive design practices.
---

# Accessibility (A11y) Skill

This skill ensures BFAAS is usable by everyone, meeting banking compliance and ethical standards.

## WCAG Checklist (Level AA)

### Interactive Elements
- [ ] **Focusable**: All buttons/links must be reachable via keyboard (Tab).
- [ ] **Visible Focus**: Custom focus rings must be visible (e.g., `ring-2 ring-offset-2`).
- [ ] **Labels**: `aria-label` for icon-only buttons.
- [ ] **Size**: Minimum touch target 44x44px.

### Structure & Semantics
- Use semantic HTML (`<main>`, `<nav>`, `<aside>`, `<button>`).
- Don't use `div` for buttons (unless `role="button"` + keyboard handlers).
- Headings (`h1` -> `h6`) must follow hierarchy.

### Forms
- [ ] **Labels**: Every input needs a visible `<label>` or `aria-labelledby`.
- [ ] **Errors**: Error messages linked via `aria-describedby`.
- [ ] **Required**: Mark required fields with `required` or `aria-required`.

### Visuals
- **Contrast**: Text ratio 4.5:1 minimum against background.
- **Color**: Don't use color alone to convey meaning (add icons or text).
- **Motion**: Respect `prefers-reduced-motion`.

## Screen Reader Support
- **Images**: Meaningful `alt` text. Empty `alt=""` for decorative images.
- **Modals**:
  - Focus trap inside modal.
  - `Esc` to close.
  - `role="dialog"`, `aria-modal="true"`.
- **Status Updates**: Use `role="status"` or `aria-live="polite"` for dynamic content changes (e.g., saving...).

## Testing
- **Keyboard Navigation**: Can you use the app with ONLY Tab/Enter/Space/Esc?
- **Tools**:
  - `axe-core` linter.
  - Chrome Lighthouse "Accessibility" audit.
  - NVDA or VoiceOver screen readers.

## Common Patterns
```tsx
// ❌ Bad
<div onClick={submit}>Submit</div>

// ✅ Good
<button 
  onClick={submit} 
  className="focus:ring-2 focus:ring-offset-2"
>
  Submit
</button>

// ❌ Bad: Icon only
<button><IconSave /></button>

// ✅ Good: Icon only
<button aria-label="Save changes">
  <IconSave aria-hidden="true" />
</button>
```
