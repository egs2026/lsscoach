---
name: design-system
description: Visual design source of truth, color palettes, typography, and component specifications.
---

# Design System Skill

This skill defines the visual language of BFAAS to ensure a premium, consistent "WOW" factor.

## Color Palette

### Primary (Brand)
- **Primary**: `hsl(var(--primary))` - Main action buttons, active states.
- **Primary Foreground**: `hsl(var(--primary-foreground))` - Text on primary backgrounds.

### Neutrals
- **Background**: `hsl(var(--background))` - Page background (clean white or rich dark).
- **Surface**: `hsl(var(--card))` - Card and panel backgrounds.
- **Text**: `hsl(var(--foreground))` - Primary text color.
- **Muted**: `hsl(var(--muted-foreground))` - Secondary text.

### Semantic
- **Destructive**: `hsl(var(--destructive))` - Error states, delete actions.
- **Success**: `hsl(var(--success))` - Completion, positive trends.
- **Warning**: `hsl(var(--warning))` - Alerts, pending actions.

## Typography

- **Font Family**: Inter (sans-serif) for clean readability.
- **Scale**:
  - `text-4xl`: Key metrics, hero headers.
  - `text-2xl`: Section headers.
  - `text-base`: Body text.
  - `text-sm`: Secondary information.
  - `text-xs`: Labels, captions.

## Spacing & Layout
- Use Tailwind's spacing scale (4 = 1rem).
- **Cards**: `p-6` padding standard.
- **Gap**: `gap-4` or `gap-6` for grid layouts.
- **Radius**: `rounded-xl` for modern, friendly feel.

## Animation (The "WOW" Factor)
- **Transitions**: `transition-all duration-200 ease-in-out` on interactive elements.
- **Hover**: Subtle lift (`-translate-y-1`) or shadow increase (`shadow-lg`).
- **Loading**: Use skeletons (`animate-pulse`) instead of generic spinners where possible.
- **Entry**: Fade-in up for new content (`animate-in fade-in slide-in-from-bottom-4`).

## Component Specs

### Buttons
- **Primary**: Solid background, bold text, shadow-sm.
- **Ghost**: Transparent background, hover background tint.
- **Size**: Min-height 44px for touch targets.

### Inputs
- Border `ring-1 ring-border`.
- Focus `ring-2 ring-primary`.
- Clear error states with message below input.

## Dark Mode
- Project supports full dark mode `class="dark"`.
- All sematic colors must map correctly to dark equivalents (e.g., pure black text -> pure white).
