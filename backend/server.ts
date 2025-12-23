import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env';
import { logger } from './utils/logger';
import publicCatalogRoutes from './routes/users/catalog';
import publicSubmissionRoutes from './routes/users/submissions';
import adminAuthRoutes from './routes/admin/auth';
import adminCatalogRoutes from './routes/admin/catalog';
import adminSubmissionRoutes from './routes/admin/submissions';

const server = Fastify({
  logger,
  requestIdLogLabel: 'requestId',
});

async function start() {
  try {
    await server.register(helmet);
    
    await server.register(cors, {
      origin: env.CORS_ORIGIN,
      credentials: true,
    });

    await server.register(jwt, {
      secret: env.JWT_SECRET,
    });

    await server.register(rateLimit, {
      max: 100,
      timeWindow: '15 minutes',
    });

    server.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    await server.register(publicCatalogRoutes, { prefix: '/api/catalog' });
    await server.register(publicSubmissionRoutes, { prefix: '/api/submissions' });
    await server.register(adminAuthRoutes, { prefix: '/api/admin/auth' });
    await server.register(adminCatalogRoutes, { prefix: '/api/admin/catalog' });
    await server.register(adminSubmissionRoutes, { prefix: '/api/admin/submissions' });

    await server.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    logger.info(`Server listening on port ${env.PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await server.close();
  process.exit(0);
});

start();