import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "./config/env";
import { initializeDatabase } from "@/config/database";
import { logger } from "@/utils/logger";
import { errorHandler } from "@/middleware/errorHandler";
import { requestLogger } from "@/middleware/requestLogger";
import { authMiddleware } from "@/middleware/auth";

// Import routes
import authRoutes from "@/routes/auth";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration
    this.app.use(
      cors({
        origin: config.cors.origin,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Compression
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.security.rateLimitWindowMs,
      max: config.security.rateLimitMaxRequests,
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use("/api", limiter);

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Request logging
    this.app.use(requestLogger);

    // Static files
    this.app.use("/uploads", express.static("uploads"));
  }

  private initializeRoutes(): void {
    const apiRouter = express.Router();

    // Health check
    apiRouter.get("/health", (req, res) => {
      res.json({
        success: true,
        message: "Solva Travel API is running",
        timestamp: new Date().toISOString(),
        version: config.apiVersion,
        environment: config.env,
      });
    });

    // Public routes
    apiRouter.use("/auth", authRoutes);

    // Protected routes (will be added later)
    // apiRouter.use('/users', authMiddleware, userRoutes);
    // apiRouter.use('/packages', packageRoutes);
    // apiRouter.use('/bookings', authMiddleware, bookingRoutes);
    // apiRouter.use('/custom-tours', customTourRoutes);
    // apiRouter.use('/reviews', reviewRoutes);
    // apiRouter.use('/gallery', galleryRoutes);
    // apiRouter.use('/staff', staffRoutes);
    // apiRouter.use('/management', authMiddleware, managementRoutes);

    // Mount API routes
    this.app.use(`/api/${config.apiVersion}`, apiRouter);

    // Root endpoint
    this.app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "Welcome to Solva Travel API",
        version: config.apiVersion,
        documentation: `/api/${config.apiVersion}/docs`,
        health: `/api/${config.apiVersion}/health`,
      });
    });

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database
      await initializeDatabase();

      // Start server
      this.app.listen(config.port, () => {
        logger.info(`🚀 Solva Travel API Server started successfully`);
        logger.info(`📍 Server running on port ${config.port}`);
        logger.info(`🌍 Environment: ${config.env}`);
        logger.info(
          `📚 API Documentation: http://localhost:${config.port}/api/${config.apiVersion}/docs`
        );
        logger.info(
          `❤️  Health Check: http://localhost:${config.port}/api/${config.apiVersion}/health`
        );
      });
    } catch (error) {
      logger.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }
}

// Start the application
const app = new App();
app.start().catch((error) => {
  logger.error("❌ Application startup failed:", error);
  process.exit(1);
});

export default app;
