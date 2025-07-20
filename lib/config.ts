// Configuration file for environment variables and app settings

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || "v1",
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
  RETRY_ATTEMPTS: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || "3"),
  RETRY_DELAY: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || "1000"),
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || "accessToken",
  REFRESH_TOKEN_KEY:
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "refreshToken",
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || "FEDPOFFA CBT Portal",
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  ENVIRONMENT: process.env.NEXT_PUBLIC_APP_ENVIRONMENT || "development",
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  DARK_MODE: process.env.NEXT_PUBLIC_FEATURE_DARK_MODE === "true",
  NOTIFICATIONS: process.env.NEXT_PUBLIC_FEATURE_NOTIFICATIONS === "true",
  ANALYTICS: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === "true",
  BETA_FEATURES: process.env.NEXT_PUBLIC_FEATURE_BETA_FEATURES === "true",
} as const;

// Development Configuration
export const DEV_CONFIG = {
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
  LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || "info",
} as const;

// Semi-robot helper: Validate required environment variables
export const validateEnvironment = (): void => {
  const requiredVars = ["NEXT_PUBLIC_API_BASE_URL"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn("⚠️ Missing environment variables:", missingVars);
    console.warn(
      "Please check your .env file and ensure all required variables are set."
    );
  }
};

// Semi-robot helper: Get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}${endpoint}`;
};

// Semi-robot helper: Check if running in development
export const isDevelopment = (): boolean => {
  return (
    APP_CONFIG.ENVIRONMENT === "development" ||
    process.env.NODE_ENV === "development"
  );
};

// Semi-robot helper: Check if running in production
export const isProduction = (): boolean => {
  return (
    APP_CONFIG.ENVIRONMENT === "production" ||
    process.env.NODE_ENV === "production"
  );
};

// Semi-robot helper: Get storage key with prefix
export const getStorageKey = (key: string): string => {
  return `${APP_CONFIG.NAME.toLowerCase().replace(/\s+/g, "-")}-${key}`;
};

// Semi-robot helper: Log with environment-aware levels
export const log = {
  debug: (message: string, ...args: any[]) => {
    if (DEV_CONFIG.DEBUG_MODE) {
      console.log(`🔍 [DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    console.log(`ℹ️ [INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ [WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`❌ [ERROR] ${message}`, ...args);
  },
};

// Semi-robot helper: Get configuration summary
export const getConfigSummary = () => {
  return {
    api: {
      baseUrl: API_CONFIG.BASE_URL,
      version: API_CONFIG.VERSION,
      timeout: API_CONFIG.TIMEOUT,
    },
    app: {
      name: APP_CONFIG.NAME,
      version: APP_CONFIG.VERSION,
      environment: APP_CONFIG.ENVIRONMENT,
    },
    features: FEATURE_FLAGS,
    development: DEV_CONFIG.DEBUG_MODE,
  };
};

// Validate environment on module load
if (typeof window !== "undefined") {
  validateEnvironment();
}
