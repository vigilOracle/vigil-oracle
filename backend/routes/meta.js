// The 3 meta endpoints: /health, /status, /skills. Registered under /api.

import { SKILLS, randomBetween, recentISO } from '../lib/seeds.js';

const VERSION = '0.1.0';

export default async function metaRoutes(fastify) {
  // --- health — used by the Railway health check ------------------------
  fastify.get('/health', async () => ({
    status: 'ok',
    uptime_s: Math.floor(process.uptime()),
    version: VERSION,
    timestamp: new Date().toISOString(),
  }));

  // --- status — headline counters, drifting slightly per call -----------
  fastify.get('/status', async () => ({
    agents_active: randomBetween(1200, 1300),
    prophecies_cast: randomBetween(38000, 39000),
    watch_hours: randomBetween(144000, 145000),
    skills_available: 32,
  }));

  // --- skills — list all 8 skills with metadata -------------------------
  fastify.get('/skills', async () => ({
    count: Object.keys(SKILLS).length,
    skills: Object.entries(SKILLS).map(([name, meta]) => ({
      name,
      tier: meta.tier,
      cron: meta.cron,
      description: meta.description,
      last_ran_at: recentISO(240),
    })),
  }));
}
