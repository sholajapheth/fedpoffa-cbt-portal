import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { API_CONFIG, AUTH_CONFIG, DEV_CONFIG, log } from "@/lib/config";

// Create base Axios instance with common configuration
export const createAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Get token from Zustand store if available
      let token: string | null = null;

      if (typeof window !== "undefined") {
        // Try to get token from Zustand store first
        try {
          const authStore =
            require("@/lib/stores/auth-store").useAuthStore.getState();
          token = authStore.accessToken;
        } catch (error) {
          // Fallback to localStorage if Zustand store is not available
          token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add request ID for tracking
      config.headers["X-Request-ID"] = generateRequestId();

      // Log request in development
      if (DEV_CONFIG.DEBUG_MODE) {
        log.debug("API Request", {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      log.error("Request Error", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (DEV_CONFIG.DEBUG_MODE) {
        log.debug("API Response", {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }

      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      // Handle 401 errors with token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Get refresh token from Zustand store
          let refreshToken: string | null = null;

          if (typeof window !== "undefined") {
            try {
              const authStore =
                require("@/lib/stores/auth-store").useAuthStore.getState();
              refreshToken = authStore.refreshToken;
            } catch (error) {
              // Fallback to localStorage
              refreshToken = localStorage.getItem(
                AUTH_CONFIG.REFRESH_TOKEN_KEY
              );
            }
          }

          if (refreshToken) {
            const response = await instance.post("/auth/refresh", {
              refresh_token: refreshToken,
            });

            const { access_token, refresh_token } = response.data;

            // Update tokens in Zustand store
            if (typeof window !== "undefined") {
              try {
                const authStore =
                  require("@/lib/stores/auth-store").useAuthStore.getState();
                authStore.setTokens(access_token, refresh_token);
              } catch (error) {
                // Fallback to localStorage
                localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, access_token);
                localStorage.setItem(
                  AUTH_CONFIG.REFRESH_TOKEN_KEY,
                  refresh_token
                );
              }
            }

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, clear auth state
          if (typeof window !== "undefined") {
            try {
              const authStore =
                require("@/lib/stores/auth-store").useAuthStore.getState();
              authStore.clearAuth();
            } catch (error) {
              // Fallback to localStorage
              localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
              localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
            }
          }
        }
      }

      // Log error in development
      if (DEV_CONFIG.DEBUG_MODE) {
        log.error("API Error", {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Generate unique request ID
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Create default API client instance
export const apiClient = createAxiosInstance();

// Error handling utility
export const handleApiError = (error: any) => {
  if (error.response) {
    const data = error.response.data;
    return {
      message:
        data.message ||
        data.error ||
        `HTTP ${error.response.status}: ${error.response.statusText}`,
      status: error.response.status,
      code: data.code,
    };
  }

  if (error.request) {
    return {
      message: "Network error: Unable to connect to server",
      code: "NETWORK_ERROR",
    };
  }

  return {
    message: error.message || "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
  };
};

// Retry utility for failed requests
export const retryRequest = async <T>(
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

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (axios.isAxiosError(error) && error.response?.status) {
        const status = error.response.status;
        if (status >= 400 && status < 500 && status !== 429) {
          throw error;
        }
      }

      if (i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i))
        );
      }
    }
  }

  throw lastError;
};

// Debounce utility for API calls
export const debounce = <T extends any[], R>(
  func: (...args: T) => Promise<R>,
  wait: number = 300
): ((...args: T) => Promise<R>) => {
  let timeoutId: NodeJS.Timeout;
  let pendingPromise: Promise<R> | null = null;

  return async (...args: T): Promise<R> => {
    if (pendingPromise) {
      return pendingPromise;
    }

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          pendingPromise = func(...args);
          const result = await pendingPromise;
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          pendingPromise = null;
        }
      }, wait);
    });
  };
};

// Export types for use in other files
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };
