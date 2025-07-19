import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

interface Config {
  env: string;
  port: number;
  apiVersion: string;
  
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    synchronize: boolean;
    logging: boolean;
  };
  
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  
  email: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  
  security: {
    bcryptRounds: number;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };
  
  cors: {
    origin: string;
  };
  
  logging: {
    level: string;
    file: string;
  };
  
  upload: {
    maxSize: number;
    allowedTypes: string[];
  };
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
};

const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
};

const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const config: Config = {
  env: getEnvVar('NODE_ENV', 'development'),
  port: getEnvNumber('PORT', 5000),
  apiVersion: getEnvVar('API_VERSION', 'v1'),
  
  database: {
    host: getEnvVar('DB_HOST', 'localhost'),
    port: getEnvNumber('DB_PORT', 5432),
    username: getEnvVar('DB_USER', getEnvVar('DB_USERNAME', 'postgres')),
    password: getEnvVar('DB_PASS', getEnvVar('DB_PASSWORD', 'password')),
    name: getEnvVar('DB_NAME', 'solva_travel'),
    synchronize: getEnvBoolean('DB_SYNCHRONIZE', true),
    logging: getEnvBoolean('DB_LOGGING', false),
  },
  
  jwt: {
    secret: getEnvVar('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '1h'),
    refreshSecret: getEnvVar('JWT_REFRESH_SECRET', 'your-super-secret-refresh-key-change-this-in-production'),
    refreshExpiresIn: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  
  email: {
    host: getEnvVar('EMAIL_HOST', 'smtp.gmail.com'),
    port: getEnvNumber('EMAIL_PORT', 587),
    user: getEnvVar('EMAIL_USER', 'test@example.com'),
    pass: getEnvVar('EMAIL_PASS', 'test-password'),
    from: getEnvVar('EMAIL_FROM', 'noreply@solvatravel.com'),
  },
  
  security: {
    bcryptRounds: getEnvNumber('BCRYPT_ROUNDS', 12),
    rateLimitWindowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
    rateLimitMaxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
  },
  
  cors: {
    origin: getEnvVar('CORS_ORIGIN', 'http://localhost:3000'),
  },
  
  logging: {
    level: getEnvVar('LOG_LEVEL', 'info'),
    file: getEnvVar('LOG_FILE', 'logs/app.log'),
  },
  
  upload: {
    maxSize: getEnvNumber('UPLOAD_MAX_SIZE', 10485760), // 10MB
    allowedTypes: getEnvVar('UPLOAD_ALLOWED_TYPES', 'image/jpeg,image/png,image/gif,image/webp').split(','),
  },
};

// Validate critical environment variables in production
if (config.env === 'production') {
  const requiredVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'DB_PASSWORD',
    'EMAIL_USER',
    'EMAIL_PASS',
  ];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is required in production`);
    }
  }
}

export default config;