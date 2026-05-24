// ============================================================
// ATHLETE//ZERO — Express App Configuration
// ============================================================

import express from 'express';
import cors from 'cors';
import { config } from './config/index';
import { successResponse } from './utils/index';
import { isGeminiConfigured } from './services/gemini.service';

// Import Routes
import playerRoutes from './routes/player.routes';
import matchRoutes from './routes/match.routes';
import socialRoutes from './routes/social.routes';
import rivalRoutes from './routes/rival.routes';
import storyRoutes from './routes/story.routes';

const app = express();

// ---- Middleware ----
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (dev only)
if (config.isDev) {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ---- Health Check ----
app.get('/health', (_req, res) => {
  res.json(
    successResponse({
      status: 'OPERATIONAL',
      service: 'ATHLETE//ZERO Backend',
      version: '1.0.0',
      gemini: isGeminiConfigured() ? 'CONNECTED' : 'NOT CONFIGURED (using mock data)',
      environment: config.nodeEnv,
    })
  );
});

// ---- API Routes ----
app.use('/api', playerRoutes);
app.use('/api', matchRoutes);
app.use('/api', socialRoutes);
app.use('/api', rivalRoutes);
app.use('/api', storyRoutes);

// ---- 404 Handler ----
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: 'ATHLETE//ZERO API — Check /health for available endpoints',
    timestamp: new Date().toISOString(),
  });
});

// ---- Global Error Handler ----
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

export default app;
