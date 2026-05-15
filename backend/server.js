// VIGIL ORACLE — backend entry point.
// Stateless Fastify API powering the landing-page demos.

import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import routes from './routes/index.js';

const VERSION = '0.1.0';

const fastify = Fastify({
  logger: { level: process.env.LOG_LEVEL || 'info' },
});

// CORS — open by default so the frontend can fetch from anywhere in dev.
await fastify.register(cors, {
  origin: process.env.FRONTEND_ORIGIN || '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin'],
});

// Concise per-request access log (no PII — there is no user auth).
fastify.addHook('onResponse', (request, reply, done) => {
  request.log.info(
    `${request.method} ${request.url} → ${reply.statusCode} (${reply.elapsedTime.toFixed(1)}ms)`
  );
  done();
});

// Root banner.
fastify.get('/', async () => ({
  name: 'VIGIL ORACLE — backend',
  version: VERSION,
  status: 'WATCHING',
  docs: '/api/health',
}));

await fastify.register(routes);

// Listen on the Railway-provided port, bound to all interfaces.
const port = Number(process.env.PORT) || 3001;
try {
  await fastify.listen({ host: '0.0.0.0', port });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
