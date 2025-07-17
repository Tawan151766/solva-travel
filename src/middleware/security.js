import { NextResponse } from "next/server";

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map();

// CORS configuration
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://your-domain.com", // Replace with your production domain
];

// Rate limiting configuration
const RATE_LIMITS = {
  "/api/auth/login": { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  "/api/auth/register": { requests: 3, window: 60 * 60 * 1000 }, // 3 requests per hour
  "/api/reviews": { requests: 10, window: 60 * 60 * 1000 }, // 10 requests per hour
  "/api/custom-tour-requests": { requests: 5, window: 60 * 60 * 1000 }, // 5 requests per hour
  default: { requests: 100, window: 60 * 60 * 1000 }, // 100 requests per hour for other endpoints
};

// Get client IP address
function getClientIP(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const remoteAddr = request.headers.get("x-vercel-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP.trim();
  }
  if (remoteAddr) {
    return remoteAddr.split(",")[0].trim();
  }

  return "unknown";
}

// Rate limiting function
function checkRateLimit(ip, path) {
  const now = Date.now();
  const key = `${ip}:${path}`;

  // Get rate limit config for this path
  const config = RATE_LIMITS[path] || RATE_LIMITS.default;

  // Clean up old entries
  if (rateLimitStore.has(key)) {
    const requests = rateLimitStore
      .get(key)
      .filter((timestamp) => now - timestamp < config.window);
    rateLimitStore.set(key, requests);
  }

  // Get current request count
  const requests = rateLimitStore.get(key) || [];

  // Check if rate limit exceeded
  if (requests.length >= config.requests) {
    return false;
  }

  // Add current request
  requests.push(now);
  rateLimitStore.set(key, requests);

  return true;
}

// CORS headers function
function setCORSHeaders(response, origin) {
  if (
    ALLOWED_ORIGINS.includes(origin) ||
    process.env.NODE_ENV === "development"
  ) {
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

// Security headers function
function setSecurityHeaders(response) {
  // Prevent XSS attacks
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // HTTPS enforcement (in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;"
  );

  return response;
}

// Input sanitization function
export function sanitizeInput(input) {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .substring(0, 1000); // Limit length
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validate phone number
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[0-9\-\(\)\s]{8,15}$/;
  return phoneRegex.test(phone);
}

// Password strength validation
export function isStrongPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

// Main security middleware
export function securityMiddleware(request) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");
  const ip = getClientIP(request);

  // Skip middleware for static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  // Handle OPTIONS requests (CORS preflight)
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    return setCORSHeaders(response, origin);
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip, pathname)) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
          error: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }
  }

  // Continue with the request
  const response = NextResponse.next();

  // Set security headers
  setSecurityHeaders(response);

  // Set CORS headers for API routes
  if (pathname.startsWith("/api/")) {
    setCORSHeaders(response, origin);
  }

  return response;
}

export default securityMiddleware;
