# Zustand Setup & Semi-Robot Helpers

This document outlines the Zustand state management setup and custom semi-robot helpers implemented in the FEDPOFFA CBT Portal.

## Overview

The application uses Zustand for state management with three main stores:
- **Auth Store**: Handles authentication state
- **UI Store**: Manages UI state, theme, notifications, and modals
- **App Store**: Manages app-wide state, navigation, and feature flags

## Store Architecture

### 1. Auth Store (`lib/stores/auth-store.ts`)

Manages user authentication state with persistence.

**State:**
- `user`: Current user object
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `error`: Error messages

**Actions:**
- `login(email, password)`: Authenticate user
- `logout()`: Clear authentication
- `register(userData)`: Register new user
- `updateProfile(userData)`: Update user profile
- `clearError()`: Clear error state
- `setLoading(loading)`: Set loading state

**Semi-Robot Helpers:**
- `createAction()`: Wraps actions with error handling
- `validateUser()`: Validates user data structure
- `mockApiCall()`: Simulates API calls (replace with real API)

### 2. UI Store (`lib/stores/ui-store.ts`)

Manages UI state, theme, notifications, and modals.

**State:**
- `theme`: Current theme (light/dark/system)
- `sidebarOpen`: Sidebar visibility
- `sidebarCollapsed`: Sidebar collapsed state
- `modals`: Modal states
- `notifications`: Notification array
- `loadingStates`: Loading states for different operations

**Actions:**
- `setTheme(theme)`: Set application theme
- `toggleSidebar()`: Toggle sidebar visibility
- `openModal(modalId)`: Open modal
- `closeModal(modalId)`: Close modal
- `addNotification(notification)`: Add notification
- `removeNotification(id)`: Remove notification
- `setLoading(key, loading)`: Set loading state

**Semi-Robot Helpers:**
- `generateId()`: Generate unique IDs
- `isValidTheme()`: Validate theme values
- `isValidNotificationType()`: Validate notification types
- `createNotification()`: Create notification with defaults
- `autoRemoveNotification()`: Auto-remove expired notifications

### 3. App Store (`lib/stores/app-store.ts`)

Manages app-wide state, navigation, and feature flags.

**State:**
- `currentPath`: Current navigation path
- `breadcrumbs`: Navigation breadcrumbs
- `navigationItems`: Navigation menu items
- `appVersion`: Application version
- `lastUpdateCheck`: Last update check timestamp
- `isOnline`: Online status
- `featureFlags`: Feature flag states

**Actions:**
- `setCurrentPath(path)`: Set current path
- `setBreadcrumbs(breadcrumbs)`: Set breadcrumbs
- `addBreadcrumb(breadcrumb)`: Add breadcrumb
- `setNavigationItems(items)`: Set navigation items
- `setFeatureFlag(flag, enabled)`: Toggle feature flag
- `setOnlineStatus(online)`: Set online status

**Semi-Robot Helpers:**
- `validateNavigationItem()`: Validate navigation items
- `generateBreadcrumbsFromPath()`: Generate breadcrumbs from path
- `deepClone()`: Deep clone objects
- `debounce()`: Debounce function calls

## Custom Hooks

### Combined Store Hooks (`hooks/use-stores.ts`)

**`useStores()`**
Combines all stores into a single hook for easy access.

```typescript
const { auth, ui, app } = useStores();
```

**`useAuthWithFeedback()`**
Authentication with automatic UI feedback (notifications, loading states).

```typescript
const { loginWithFeedback, logoutWithFeedback, user, isAuthenticated } = useAuthWithFeedback();
```

**`useNavigationWithBreadcrumbs()`**
Navigation with automatic breadcrumb management.

```typescript
const { navigateTo, navigateWithBreadcrumb, currentPath, breadcrumbs } = useNavigationWithBreadcrumbs();
```

**`useThemeManager()`**
Theme management with toggle functionality.

```typescript
const { theme, toggleTheme, setSystemTheme } = useThemeManager();
```

**`useModalManager()`**
Modal management with open/close functionality.

```typescript
const { openModal, closeModal, isModalOpen } = useModalManager();
```

**`useNotificationManager()`**
Notification management with type-specific methods.

```typescript
const { showSuccess, showError, showWarning, showInfo } = useNotificationManager();
```

**`useOnlineStatus()`**
Online status monitoring with automatic notifications.

```typescript
const { isOnline } = useOnlineStatus();
```

**`useFeatureFlags()`**
Feature flag management with toggle functionality.

```typescript
const { isFeatureEnabled, toggleFeature, featureFlags } = useFeatureFlags();
```

## Utility Helpers (`lib/helpers.ts`)

### Validation Helpers
- `isValidEmail(email)`: Validate email format
- `isValidPassword(password)`: Validate password strength
- `isValidPhoneNumber(phone)`: Validate phone number

### Formatting Helpers
- `formatCurrency(amount, currency)`: Format currency
- `formatDate(date, options)`: Format dates
- `formatRelativeTime(date)`: Format relative time
- `formatFileSize(bytes)`: Format file sizes

### String Manipulation
- `capitalize(str)`: Capitalize string
- `truncate(str, length, suffix)`: Truncate string
- `slugify(str)`: Create URL-friendly slug

### Array and Object Helpers
- `groupBy(array, key)`: Group array by key
- `sortBy(array, key, direction)`: Sort array by key
- `unique(array)`: Remove duplicates

### Performance Helpers
- `debounce(func, wait)`: Debounce function calls
- `throttle(func, limit)`: Throttle function calls

### Storage Helpers
- `storage.get(key, defaultValue)`: Get from localStorage
- `storage.set(key, value)`: Set to localStorage
- `storage.remove(key)`: Remove from localStorage
- `storage.clear()`: Clear localStorage

### URL Helpers
- `getQueryParam(param)`: Get query parameter
- `setQueryParam(param, value)`: Set query parameter
- `removeQueryParam(param)`: Remove query parameter

### Type Guards
- `isObject(value)`: Check if value is object
- `isArray(value)`: Check if value is array
- `isString(value)`: Check if value is string
- `isNumber(value)`: Check if value is number
- `isBoolean(value)`: Check if value is boolean
- `isFunction(value)`: Check if value is function

## Provider Setup

### Store Provider (`components/providers/store-provider.tsx`)

The `StoreProvider` component initializes stores and sets up global listeners:

- **Online Status Monitoring**: Automatically detects online/offline status
- **Theme Synchronization**: Syncs theme with system preference
- **Notification Auto-Cleanup**: Automatically removes expired notifications
- **Responsive Behavior**: Handles window resize events
- **Page Visibility**: Monitors page visibility changes

### Usage in Layout

```typescript
// app/layout.tsx
<StoreProvider>
  <AuthProvider>
    {children}
    <NotificationContainer />
    <Toaster />
  </AuthProvider>
</StoreProvider>
```

## Notification System

### Notification Container (`components/ui/notification-toast.tsx`)

Features:
- **Auto-dismiss**: Notifications automatically disappear after duration
- **Progress Bar**: Visual progress indicator
- **Smooth Animations**: Enter/exit animations
- **Type-specific Styling**: Different styles for success, error, warning, info
- **Manual Dismiss**: Click X to dismiss early

### Usage

```typescript
// Using the notification manager hook
const { showSuccess, showError } = useNotificationManager();

showSuccess('Success!', 'Operation completed successfully');
showError('Error!', 'Something went wrong');
```

## Best Practices

### 1. Store Organization
- Keep stores focused on specific domains
- Use TypeScript interfaces for type safety
- Implement persistence where needed
- Use partialize for selective persistence

### 2. Semi-Robot Helpers
- Create reusable validation functions
- Implement error handling patterns
- Use debouncing for performance
- Provide sensible defaults

### 3. Performance
- Use selective subscriptions to avoid unnecessary re-renders
- Implement proper cleanup in useEffect hooks
- Use debouncing for frequent operations
- Cache expensive computations

### 4. Error Handling
- Wrap async operations with try-catch
- Provide meaningful error messages
- Implement fallback states
- Log errors for debugging

## Migration Guide

### From Context API
1. Replace `useContext` with store hooks
2. Remove Context providers
3. Update component subscriptions
4. Test state persistence

### From Redux
1. Replace `useSelector` with store selectors
2. Replace `useDispatch` with store actions
3. Remove Redux middleware
4. Update action creators

## Troubleshooting

### Common Issues

1. **Store not updating**: Check if component is subscribed to correct store
2. **Persistence not working**: Verify localStorage is available
3. **Performance issues**: Use selective subscriptions
4. **Type errors**: Ensure TypeScript interfaces are correct

### Debug Tools

```typescript
// Access store state for debugging
const authState = useAuthStore.getState();
const uiState = useUIStore.getState();
const appState = useAppStore.getState();
```

## Future Enhancements

1. **DevTools Integration**: Add Zustand DevTools for debugging
2. **Middleware Support**: Add custom middleware for logging, analytics
3. **Real-time Sync**: Implement real-time state synchronization
4. **Offline Support**: Enhanced offline state management
5. **Performance Monitoring**: Add performance metrics and monitoring 