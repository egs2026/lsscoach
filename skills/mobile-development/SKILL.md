---
name: mobile-development
description: Guidelines for building the mobile application using React Native, Expo, and NativeWind.
---

# Mobile Development Skill

This skill defines the architecture and best practices for extending BFAAS to mobile platforms (iOS & Android).

## Technology Stack
- **Framework**: React Native with **Expo** (Managed Workflow).
- **Navigation**: **Expo Router** (file-based routing, matches web paradigms).
- **Styling**: **NativeWind** (Tailwind CSS for React Native).
- **Components**: **React Native Paper** or custom components matching the Design System.

## Architecture & Code Sharing

### Strategy
Since the project currently resides in a single repository, we aim to maximize code reuse between Web (`src/`) and Mobile (`apps/mobile/` or similar).

### Shared Layers
- **Services**: API calls to Supabase should be platform-agnostic.
- **Hooks**: Business logic (e.g., `useLeadSubmit`, `useAuth`) should be reused.
- **Types**: One single source of truth for TypeScript interfaces.

### Platform Specifics
- **Web**: HTML/CSS (React DOM).
- **Mobile**: `<View>`, `<Text>`, `<Image>` (React Native).

## Navigation Structure (Expo Router)
```
app/
  (auth)/
    login.tsx
  (tabs)/
    dashboard/
      index.tsx
    leads/
      index.tsx
  _layout.tsx
```

## Native Features
- **Document Scanning**: Use `expo-camera` or `expo-image-picker` for capturing KTP/documents.
- **Push Notifications**: Use `expo-notifications` for real-time lead updates.
- **Location**: Use `expo-location` for agent tracking/check-ins.
- **Offline Mode**: Use `@tanstack/react-query` with persistence or local SQLite for offline-first capability.

## Development Workflow
1.  **Setup**: Install Expo Go on physical device.
2.  **Run**: `npx expo start` in the mobile directory.
3.  **Build**: Use EAS (Expo Application Services) for building `.apk` and `.ipa`.

## Best Practices
- **Safe Area**: Always wrap screens in `<SafeAreaView>`.
- **Keyboard**: Use `<KeyboardAvoidingView>` for forms.
- **Permissions**: Gracefully handle permission requests (Camera, Location) with explanation UI.
- **Performance**: Use `<FlashList>` instead of `<FlatList>` for long lists.
