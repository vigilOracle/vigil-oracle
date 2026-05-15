// The 8 skill endpoints. Registered under the /api/skills prefix.
// whale-watch hits the real Helius API; the other 7 return mock data.

import { SKILLS, randomBetween } from '../lib/seeds.js';
import { MOCK_GENERATORS, whaleWatchMock } from '../lib/mock.js';
import { getWhaleTransfers } from '../lib/helius.js';

// Hard ceiling for the whale-watch real call. Helius is queried sequentially
// (2 fetches × 3.5s + gap); this guards against anything else hanging.
const WHALE_TIMEOUT_MS = 7500;

// Stamp a generator result with the consistent response envelope.
function envelope(skillName, { beacons, summary }, dataSource, durationMs) {
  const meta = SKILLS[skillName];
  return {
    skill: skillName,
    tier: meta.tier,
    cron: meta.cron,
    ran_at: new Date().toISOString(),
    duration_ms: durationMs,
    data_source: dataSource,
    beacons,
    summary,
  };
}

// Race a promise against a timeout, rejecting if it overruns.
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export default async function skillsRoutes(fastify) {
  // --- whale-watch — real-ish, Helius-backed ----------------------------
  fastify.get('/whale-watch', async () => {
    const t0 = Date.now();
    try {
      const result = await withTimeout(getWhaleTransfers(), WHALE_TIMEOUT_MS);
      return envelope('whale-watch', result, 'live', Date.now() - t0);
    } catch (err) {
      fastify.log.warn({ err: err.message }, 'whale-watch fell back to mock');
      return envelope('whale-watch', whaleWatchMock(), 'mock_fallback', Date.now() - t0);
    }
  });

  // --- the 7 mock skills ------------------------------------------------
  for (const [skillName, generator] of Object.entries(MOCK_GENERATORS)) {
    fastify.get(`/${skillName}`, async () => {
      return envelope(skillName, generator(), 'mock', randomBetween(120, 900));
    });
  }
}
