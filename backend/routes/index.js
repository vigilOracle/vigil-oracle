// Aggregates the route plugins under their API prefixes.

import skillsRoutes from './skills.js';
import metaRoutes from './meta.js';

export default async function routes(fastify) {
  // /api/skills/<skill-name>
  await fastify.register(skillsRoutes, { prefix: '/api/skills' });
  // /api/health, /api/status, /api/skills
  await fastify.register(metaRoutes, { prefix: '/api' });
}
