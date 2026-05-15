# VIGIL ORACLE — Backend

Stateless Fastify API for **VIGIL ORACLE ($VGL)** — an autonomous AI agent
framework for crypto traders. Powers the landing-page demos and the live
terminal section. Hosts mock execution outputs for 7 skills plus one
real-ish endpoint (`whale-watch`, backed by the Helius API).

No database, no auth — pure stateless API.

## Quickstart

```bash
npm install
cp .env.example .env      # then fill in HELIUS_RPC_URL
npm run dev               # starts on http://localhost:3001 with --watch
```

`npm start` runs the server without file watching (used in production).

### Environment variables

| Var | Purpose |
|-----|---------|
| `HELIUS_RPC_URL` | Helius RPC URL — the `api-key` is extracted from it for the whale-watch Enhanced Tx API call. Get a free key at [helius.dev](https://helius.dev). |
| `PORT` | Listen port. Defaults to `3001`. Railway overrides this. |
| `FRONTEND_ORIGIN` | Allowed CORS origin. `*` by default (open during dev). |

If `HELIUS_RPC_URL` is unset or invalid, `whale-watch` still works — it
returns mock data with `data_source: "mock_fallback"`.

## Endpoints (11 total)

### Skill endpoints (8)

| Endpoint | Source |
|----------|--------|
| `GET /api/skills/whale-watch` | real-ish (Helius Enhanced Tx API) |
| `GET /api/skills/liquidation-radar` | mock |
| `GET /api/skills/funding-arb` | mock |
| `GET /api/skills/narrative-scanner` | mock |
| `GET /api/skills/kol-tracker` | mock |
| `GET /api/skills/dex-sniper-alert` | mock |
| `GET /api/skills/unlock-calendar` | mock |
| `GET /api/skills/bridge-monitor` | mock |

Each returns:

```json
{
  "skill": "whale-watch",
  "tier": "free",
  "cron": "0 */4 * * *",
  "ran_at": "2026-05-16T09:14:01.000Z",
  "duration_ms": 412,
  "data_source": "live | mock | mock_fallback",
  "beacons": [
    {
      "level": "INFO | WARN | HIT | DONE",
      "message": "Large SOL transfer — 2100.0 SOL (~$0.29M) moved",
      "address": "7xKpL2…q9Fv3R",
      "flow": "7xKpL2…q9Fv3R → 9aBcD3…E3fG4h",
      "asset": "SOL",
      "timestamp": "2026-05-16T09:13:40.000Z"
    }
  ],
  "summary": "1 whale-scale SOL transfer confirmed on-chain."
}
```

### Meta endpoints (3)

| Endpoint | Returns |
|----------|---------|
| `GET /api/health` | `{ status, uptime_s, version, timestamp }` |
| `GET /api/status` | `{ agents_active, prophecies_cast, watch_hours, skills_available }` (numbers drift per call) |
| `GET /api/skills` | list of all 8 skills with metadata |

## Example requests

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/status
curl http://localhost:3001/api/skills
curl http://localhost:3001/api/skills/whale-watch
curl http://localhost:3001/api/skills/liquidation-radar
curl http://localhost:3001/api/skills/funding-arb
curl http://localhost:3001/api/skills/narrative-scanner
curl http://localhost:3001/api/skills/kol-tracker
curl http://localhost:3001/api/skills/dex-sniper-alert
curl http://localhost:3001/api/skills/unlock-calendar
curl http://localhost:3001/api/skills/bridge-monitor
```

## Deploy (Railway)

```bash
railway link          # link to a Railway project
railway up            # build + deploy
```

`railway.json` configures the NIXPACKS build, the `node server.js` start
command, an `ON_FAILURE` restart policy, and a health check on
`/api/health`.

Set these variables in the Railway dashboard:

- `HELIUS_RPC_URL` — your Helius RPC URL
- `FRONTEND_ORIGIN` — the deployed frontend origin (or `*`)

`PORT` is provided by Railway automatically; the server binds `0.0.0.0`.

## Project structure

```
backend/
├── server.js          Fastify entry — CORS, routes, listen
├── package.json
├── railway.json
├── .env.example
├── routes/
│   ├── index.js       registers skill + meta routes under /api
│   ├── skills.js      8 skill endpoints
│   └── meta.js        /health, /status, /skills
└── lib/
    ├── helius.js      Helius Enhanced Tx wrapper for whale-watch
    ├── mock.js        beacon generators for the 7 mock skills
    └── seeds.js       address/ticker/KOL pools + helpers + skill metadata
```
