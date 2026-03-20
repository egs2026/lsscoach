---
name: frontend-standards
description: Guidelines for maintaining premium UI/UX, responsive design, and React patterns for BFAAS.
---

# Frontend Standards Skill

This skill ensures that all user interfaces within the BFAAS project meet the "WOW" factor and visual excellence requirements.

## Design Philosophy
- **Visual Excellence**: Avoid generic colors. Use curated, harmonious palettes.
- **Micro-animations**: Implement subtle transitions and hover effects to make the interface feel "alive".
- **Typography**: Use modern, readable fonts (Inter, Roboto, etc.) as configured in `tailwind.config.js`.
- **Responsive Layouts**: Ensure all components work seamlessly on mobile, tablet, and desktop.

## Technical Patterns
- **React Components**: Use functional components with hooks.
- **Styling**: Utilize Tailwind CSS for all styling. Follow the existing utility patterns.
- **State Management**: Use React context or appropriate local state management.
- **Accessibility**: Ensure all interactive elements are accessible and have proper focus states.

## Component Organization
- **Shared Components**: Located in `src/components/ui/`.
- **Feature-specific Components**: Located within their respective folders in `src/features/`.

## Best Practices
- **Performance**: Optimize image loading and minimize re-renders.
- **Clean Code**: Use descriptive names for components, props, and variables.
- **Documentation**: Comment complex logic and use TypeScript interfaces for all component props.
