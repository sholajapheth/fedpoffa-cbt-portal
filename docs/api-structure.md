# API Structure with TanStack Query + Zustand

This document outlines the new API structure that combines TanStack Query for server state management and Zustand for client state management, with a centralized Axios configuration.

## Architecture Overview

### Separation of Concerns

```
lib/
├── api/
│   ├── axios-config.ts    # Centralized Axios configuration
│   ├── client.ts          # Re-exports from axios-config
│   ├── auth/
│   │   ├── types.ts       # Auth-specific types
│   │   ├── service.ts      # Auth API service
│   │   ├── hooks.ts        # TanStack Query hooks
│   │   └── index.ts        # Barrel exports
│   ├── courses/
│   │   ├── types.ts        # Course-specific types
│   │   ├── service.ts      # Course API service
│   │   ├── hooks.ts        # TanStack Query hooks
│   │   └── index.ts        # Barrel exports
│   └── [other-services]/   # Future service modules
├── stores/
│   └── auth-store.ts       # Zustand auth store
└── providers/
    └── query-provider.tsx  # TanStack Query provider
```

### Centralized Axios Configuration

The `lib/api/axios-config.ts` file contains all the common Axios configuration that can be reused across all API services:

```typescript
// Create base Axios instance with common configuration
export const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  // Request interceptor with token management
  instance.interceptors.request.use(/* ... */);

  // Response interceptor with error handling
  instance.interceptors.response.use(/* ... */);

  return instance;
};
```

### State Management Strategy

- **TanStack Query**: Server state (API data, caching, synchronization)
- **Zustand**: Client state (UI state, user preferences, auth tokens)
- **Separation**: Clear boundaries between server and client state

## Service Module Structure

### 1. Types (`lib/api/[service]/types.ts`)

```typescript
export interface LoginRequest {
  identifier: string; // email or matric number
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}
```

### 2. Service (`lib/api/[service]/service.ts`)

```typescript
import { createAxiosInstance, handleApiError } from '@/lib/api/axios-config';

// Create service-specific axios instance
const authApi = createAxiosInstance({
  headers: {
    'X-Service': 'auth', // Custom header to identify service
  },
});

export class AuthService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authApi.post<LoginResponse>('/auth/login', data);
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}
```

### 3. Hooks (`lib/api/[service]/hooks.ts`)

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService } from './service';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser, setTokens, setIsAuthenticated } = useAuthStore();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      // Update Zustand store
      setUser(data.user);
      setTokens(data.access_token, data.refresh_token);
      setIsAuthenticated(true);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
    },
  });
};
```

### 4. Index (`lib/api/[service]/index.ts`)

```typescript
// Export all service-related modules
export * from './types';
export * from './service';
export * from './hooks';
```

## Centralized Axios Configuration

### Features

1. **Common Configuration**: Base URL, timeout, headers
2. **Token Management**: Automatic Authorization headers
3. **Request Tracking**: Unique request IDs
4. **Error Handling**: Centralized error processing
5. **Token Refresh**: Automatic 401 handling
6. **Development Logging**: Request/response logging
7. **Retry Logic**: Exponential backoff for failed requests
8. **Debouncing**: Utility for debounced API calls

### Usage in Services

```typescript
// Create service-specific instance
const courseApi = createAxiosInstance({
  headers: {
    'X-Service': 'courses',
  },
});

// Use in service methods
export class CourseService {
  static async getCourses(): Promise<Course[]> {
    try {
      const response = await courseApi.get<Course[]>('/courses');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}
```

## Adding New Services

### 1. Create Service Module

```bash
lib/api/
├── [service-name]/
│   ├── types.ts
│   ├── service.ts
│   ├── hooks.ts
│   └── index.ts
```

### 2. Service Template

```typescript
// lib/api/[service]/types.ts
export interface [Service]Request {
  // Request types
}

export interface [Service]Response {
  // Response types
}

// lib/api/[service]/service.ts
import { createAxiosInstance, handleApiError } from '@/lib/api/axios-config';

const [service]Api = createAxiosInstance({
  headers: {
    'X-Service': '[service]',
  },
});

export class [Service]Service {
  static async get[Service]s(): Promise<[Service][]> {
    try {
      const response = await [service]Api.get<[Service][]('/[service]s');
      return response.data;
    } catch (error: any) {
      throw handleApiError(error);
    }
  }
}

// lib/api/[service]/hooks.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { [Service]Service } from './service';

export const use[Service]s = () => {
  return useQuery({
    queryKey: ['[service]s'],
    queryFn: [Service]Service.get[Service]s,
  });
};

// lib/api/[service]/index.ts
export * from './types';
export * from './service';
export * from './hooks';
```

### 3. Use in Components

```typescript
import { use[Service]s } from '@/lib/api/[service]';

function [Service]List() {
  const { data: [service]s, isLoading } = use[Service]s();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {[service]s?.map([service] => (
        <div key={[service].id}>{[service].name}</div>
      ))}
    </div>
  );
}
```

## Benefits of Centralized Configuration

### 1. Consistency

- All services use the same base configuration
- Consistent error handling across services
- Uniform token management
- Standardized logging

### 2. Maintainability

- Single place to update common configuration
- Easy to add new features (e.g., request/response transformers)
- Centralized debugging and monitoring

### 3. Reusability

- Services can create custom instances with specific configs
- Common utilities (retry, debounce) available to all services
- Type-safe error handling

### 4. Performance

- Request deduplication
- Automatic caching
- Optimized retry logic
- Background synchronization

## Environment Configuration

### Required Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
NEXT_PUBLIC_API_RETRY_DELAY=1000

# Authentication
NEXT_PUBLIC_AUTH_TOKEN_KEY=accessToken
NEXT_PUBLIC_REFRESH_TOKEN_KEY=refreshToken

# Development
NEXT_PUBLIC_DEBUG_MODE=true
```

## Best Practices

### 1. Service Organization

- One service per domain (auth, courses, exams, etc.)
- Consistent naming conventions
- Shared types across the application

### 2. Hook Patterns

- Use mutations for data modifications
- Use queries for data fetching
- Handle loading and error states consistently

### 3. State Management

- Keep server state in TanStack Query
- Keep client state in Zustand
- Avoid duplicating state between layers

### 4. Error Handling

- Use centralized error handling
- Provide user-friendly error messages
- Log errors for debugging

### 5. Performance

- Use appropriate stale times
- Implement proper cache invalidation
- Optimize for user experience

## Troubleshooting

### Common Issues

1. **Token refresh not working**: Check interceptor configuration
2. **Cache not updating**: Verify query invalidation
3. **Type errors**: Ensure types are properly exported
4. **Performance issues**: Check stale times and cache configuration

### Debug Tools

- TanStack Query DevTools for debugging queries
- Browser DevTools for network requests
- Zustand DevTools for state debugging
- Request ID tracking for request correlation 