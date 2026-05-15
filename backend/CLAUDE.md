# VIGIL ORACLE — Backend

## What
Backend API for VIGIL ORACLE ($VGL) — an autonomous AI agent framework
for crypto traders. Powers the frontend landing page demos and the live
terminal section. Hosts mock execution outputs for all 8 free skills
plus 1 real-ish endpoint (whale-watch using Helius RPC).

## Stack
- Node.js (LTS, ES modules)
- Fastify (latest)
- @fastify/cors (allow frontend origin)
- dotenv (env management)
- Native fetch (Node 18+) for Helius RPC calls

No database for MVP. State in-memory.

## Endpoints (11 total)

### Skill endpoints (8)
- GET /api/skills/whale-watch       — real-ish (Helius RPC, large SOL transfers)
- GET /api/skills/liquidation-radar — mock
- GET /api/skills/funding-arb       — mock
- GET /api/skills/narrative-scanner — mock
- GET /api/skills/kol-tracker       — mock
- GET /api/skills/dex-sniper-alert  — mock
- GET /api/skills/unlock-calendar   — mock
- GET /api/skills/bridge-monitor    — mock

Each returns:
{
  skill: "whale-watch",
  tier: "free" | "prophecy",
  cron: "0 */4 * * *",
  ran_at: ISO timestamp,
  duration_ms: number,
  beacons: [
    {
      level: "INFO" | "WARN" | "HIT" | "DONE",
      message: string,
      address?: string,
      flow?: string,
      asset?: string,
      timestamp: ISO
    }
  ],
  summary: string
}

### Meta endpoints (3)
- GET /api/health    — { status: "ok", uptime_s, version }
- GET /api/status    — { agents_active, prophecies_cast, watch_hours, skills_available }
- GET /api/skills    — list all 8 skills with metadata

## Project structure
backend/
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── railway.json
├── routes/
│   ├── skills.js
│   ├── meta.js
│   └── index.js
├── lib/
│   ├── helius.js
│   ├── mock.js
│   └── seeds.js
└── README.md

## Data style (mock realism)
- Solana addresses: 44-char base58, display 7xKpL2…q9Fv3R
- Tickers: real (JUP, WIF, SOL, BONK, JTO, RAY, PYTH)
- KOL handles: plausible (@cobie, @ansem, @gainzy222)
- Timestamps: ISO 8601, recent within last 24h
- USD amounts: $150k–$5M range
- Vary beacon counts (1-5) per skill so output feels organic

## Deploy
- Railway via GitHub or `railway up` CLI
- Listen on process.env.PORT (Railway provides)
- Bind 0.0.0.0
- railway.json with restart policy + health check /api/health

## ENV vars (.env.example)
HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
PORT=3001
FRONTEND_ORIGIN=*

## Code style
- ES modules ("type": "module")
- async/await everywhere
- No TypeScript
- Comments in English
- kebab-case files, camelCase functions
- Proper fastify reply.code() error handling

## DO NOT
- Use Express (Fastify only)
- Hardcode API keys (env always)
- Skip CORS
- Block on Helius if slow — timeout at 2s, fallback gracefully
