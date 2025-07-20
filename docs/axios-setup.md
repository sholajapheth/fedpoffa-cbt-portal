# Axios Client Setup & Environment Variables

This document outlines the Axios client setup with environment variables and proper configuration for the FEDPOFFA CBT Portal.

## Overview

The application uses Axios for HTTP requests with a comprehensive setup including:
- Environment-based configuration
- Automatic token management
- Request/response interceptors
- Error handling and retry logic
- Development logging

## Environment Variables

### Required Variables

Create a `.env.local` file in your project root with the following variables:

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

# App Configuration
NEXT_PUBLIC_APP_NAME="FEDPOFFA CBT Portal"
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_ENVIRONMENT=development

# Feature Flags
NEXT_PUBLIC_FEATURE_DARK_MODE=true
NEXT_PUBLIC_FEATURE_NOTIFICATIONS=true
NEXT_PUBLIC_FEATURE_ANALYTICS=false
NEXT_PUBLIC_FEATURE_BETA_FEATURES=false

# Development
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

### Variable Descriptions

#### API Configuration
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the API server
- `NEXT_PUBLIC_API_VERSION`: API version (e.g., v1, v2)
- `NEXT_PUBLIC_API_TIMEOUT`: Request timeout in milliseconds
- `NEXT_PUBLIC_API_RETRY_ATTEMPTS`: Number of retry attempts for failed requests
- `NEXT_PUBLIC_API_RETRY_DELAY`: Delay between retry attempts in milliseconds

#### Authentication
- `NEXT_PUBLIC_AUTH_TOKEN_KEY`: LocalStorage key for access token
- `NEXT_PUBLIC_REFRESH_TOKEN_KEY`: LocalStorage key for refresh token

#### App Configuration
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Application version
- `NEXT_PUBLIC_APP_ENVIRONMENT`: Environment (development, staging, production)

#### Feature Flags
- `NEXT_PUBLIC_FEATURE_DARK_MODE`: Enable/disable dark mode
- `NEXT_PUBLIC_FEATURE_NOTIFICATIONS`: Enable/disable notifications
- `NEXT_PUBLIC_FEATURE_ANALYTICS`: Enable/disable analytics
- `NEXT_PUBLIC_FEATURE_BETA_FEATURES`: Enable/disable beta features

#### Development
- `NEXT_PUBLIC_DEBUG_MODE`: Enable/disable debug logging
- `NEXT_PUBLIC_LOG_LEVEL`: Log level (debug, info, warn, error)

## Axios Client Architecture

### File Structure
```
lib/
├── axios-client.ts    # Main Axios client with interceptors
├── config.ts          # Environment configuration
└── api.ts            # Legacy API client (deprecated)
```

### Key Features

#### 1. Environment-Based Configuration
```typescript
import { API_CONFIG, AUTH_CONFIG, DEV_CONFIG } from '@/lib/config';

// Use configuration values
const baseURL = API_CONFIG.BASE_URL;
const timeout = API_CONFIG.TIMEOUT;
const tokenKey = AUTH_CONFIG.TOKEN_KEY;
```

#### 2. Automatic Token Management
- Automatically adds Authorization header to requests
- Handles token refresh on 401 errors
- Stores tokens in localStorage with configurable keys
- Clears tokens on refresh failure

#### 3. Request/Response Interceptors
```typescript
// Request interceptor
instance.interceptors.request.use((config) => {
  // Add auth token
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add request ID
  config.headers['X-Request-ID'] = generateRequestId();
  
  // Log in development
  if (DEV_CONFIG.DEBUG_MODE) {
    log.debug('API Request', { method: config.method, url: config.url });
  }
  
  return config;
});

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Log successful responses
    if (DEV_CONFIG.DEBUG_MODE) {
      log.debug('API Response', { status: response.status, url: response.config.url });
    }
    return response;
  },
  async (error) => {
    // Handle 401 errors with token refresh
    if (error.response?.status === 401) {
      // Attempt token refresh
      // Retry original request with new token
    }
    return Promise.reject(createApiError(error));
  }
);
```

#### 4. Error Handling
```typescript
// Centralized error creation
const createApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || `HTTP ${error.response.status}`,
      status: error.response.status,
      details: error.response.data,
    };
  }
  
  if (error.request) {
    return {
      message: 'Network error: Unable to connect to server',
      code: 'NETWORK_ERROR',
    };
  }
  
  return {
    message: error.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};
```

#### 5. Retry Logic
```typescript
const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = API_CONFIG.RETRY_ATTEMPTS,
  delay: number = API_CONFIG.RETRY_DELAY
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except 429
      if (axios.isAxiosError(error) && error.response?.status) {
        const status = error.response.status;
        if (status >= 400 && status < 500 && status !== 429) {
          throw error;
        }
      }
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }

  throw lastError;
};
```

## API Service Class

### Authentication Methods
```typescript
// Login with email or matric number
await apiService.login({
  identifier: 'user@fedpoffa.edu.ng', // or '2023/001'
  password: 'password123'
});

// Register new user
await apiService.register({
  first_name: 'John',
  last_name: 'Doe',
  middle_name: 'A.',
  email: 'john.doe@fedpoffa.edu.ng',
  matric_number: '2023/001',
  password: 'password123',
  role: 'student',
  department_id: 'dept-id',
  phone_number: '+2348012345678'
});

// Refresh access token
await apiService.refreshToken({
  refresh_token: 'refresh-token-here'
});

// Logout
await apiService.logout();
```

### User Methods
```typescript
// Get user profile
const profile = await apiService.getUserProfile();

// Update user profile
await apiService.updateUserProfile({
  first_name: 'Updated Name'
});
```

### Department Methods
```typescript
// Get all departments
const departments = await apiService.getDepartments();

// Get specific department
const department = await apiService.getDepartment('dept-id');
```

### Course Methods
```typescript
// Get all courses
const courses = await apiService.getCourses();

// Get specific course
const course = await apiService.getCourse('course-id');

// Enroll in course
await apiService.enrollCourse('course-id');
```

### Exam Methods
```typescript
// Get all exams
const exams = await apiService.getExams();

// Get specific exam
const exam = await apiService.getExam('exam-id');

// Start exam
await apiService.startExam('exam-id');

// Submit exam
await apiService.submitExam('exam-id', {
  answers: { question1: 'answer1', question2: 'answer2' }
});

// Get exam results
const results = await apiService.getExamResults('exam-id');
```

### Question Methods
```typescript
// Get all questions
const questions = await apiService.getQuestions();

// Get specific question
const question = await apiService.getQuestion('question-id');

// Create question
await apiService.createQuestion({
  text: 'What is the capital of Nigeria?',
  options: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
  correct_answer: 1
});

// Update question
await apiService.updateQuestion('question-id', {
  text: 'Updated question text'
});

// Delete question
await apiService.deleteQuestion('question-id');
```

## Usage in Components

### Basic Usage
```typescript
import { apiService } from '@/lib/axios-client';

const MyComponent = () => {
  const handleLogin = async () => {
    try {
      const response = await apiService.login({
        identifier: 'user@fedpoffa.edu.ng',
        password: 'password123'
      });
      
      console.log('Login successful:', response.user);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
};
```

### With Zustand Store
```typescript
import { apiService } from '@/lib/axios-client';
import { useAuthStore } from '@/lib/stores/auth-store';

const useAuthWithApi = () => {
  const { login, logout, user } = useAuthStore();

  const handleLogin = async (identifier: string, password: string) => {
    try {
      const response = await apiService.login({ identifier, password });
      login(response); // Update Zustand store
    } catch (error) {
      throw error;
    }
  };

  return { handleLogin, user };
};
```

## Development Features

### Debug Logging
When `NEXT_PUBLIC_DEBUG_MODE=true`, the client logs:
- All API requests with method, URL, and data
- All API responses with status and data
- All API errors with details
- Token refresh attempts

### Request Tracking
Each request gets a unique ID for tracking:
```typescript
headers['X-Request-ID'] = generateRequestId();
```

### Error Types
```typescript
interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}
```

## Best Practices

### 1. Environment Variables
- Always use environment variables for configuration
- Never hardcode API URLs or credentials
- Use descriptive variable names
- Provide sensible defaults

### 2. Error Handling
- Always wrap API calls in try-catch blocks
- Use the centralized error handling
- Provide user-friendly error messages
- Log errors for debugging

### 3. Token Management
- Let the interceptors handle token management
- Don't manually manage tokens in components
- Use the configuration for token keys
- Handle token refresh automatically

### 4. Retry Logic
- Use the built-in retry mechanism
- Don't retry on client errors (4xx)
- Use exponential backoff for retries
- Set reasonable retry limits

### 5. Development
- Enable debug mode in development
- Use the logging utilities
- Monitor network requests
- Test error scenarios

## Migration from Fetch

If migrating from fetch to Axios:

1. Replace fetch calls with apiService methods
2. Update error handling to use ApiError type
3. Remove manual token management
4. Update environment variables
5. Test all API endpoints

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check API_BASE_URL configuration
2. **Token Issues**: Verify AUTH_TOKEN_KEY configuration
3. **Timeout Errors**: Increase API_TIMEOUT value
4. **Retry Loops**: Check API_RETRY_ATTEMPTS setting
5. **Debug Logs**: Ensure DEBUG_MODE is enabled

### Debug Commands

```typescript
// Check configuration
import { getConfigSummary } from '@/lib/config';
console.log(getConfigSummary());

// Check environment validation
import { validateEnvironment } from '@/lib/config';
validateEnvironment();
```

## Future Enhancements

1. **Request Caching**: Add response caching
2. **Request Queuing**: Queue requests when offline
3. **Progress Tracking**: Add upload/download progress
4. **Request Cancellation**: Add request cancellation
5. **Rate Limiting**: Add rate limiting protection 