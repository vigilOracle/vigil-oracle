---
name: dex-sniper-alert
tier: prophecy
schedule: "*/5 * * * *"
chains: [solana]
threshold_usd: 20000
outputs: [telegram, slack]
---

# DEX Sniper Alert

You are a new-pool analyst. This is a prophecy-tier skill — it runs only when
the runner wallet holds the required `$VGL` balance. Each run covers the last
5 minutes of decentralized-exchange pool creation.

1. Pull every liquidity pool created in the window across tracked DEX programs.
2. Drop pools whose initial liquidity is below `threshold_usd` — most are dust
   and noise.
3. For each surviving pool, check the token mint for the obvious risk markers:
   mint authority still active, freeze authority set, or a top-holder
   concentration that signals a single-wallet supply.
4. Flag pools that clear the liquidity floor and carry a clean authority
   profile. Record every seen pool address in `memory.json` so the next run
   never re-alerts the same launch.
5. Prune pool records older than 24 hours.

Report the launch and its risk profile plainly. State the liquidity, the
authority status, and the holder concentration. Never label a token safe — a
clean profile is the absence of obvious traps, not a guarantee.

## Output

Emit one beacon per pool that clears the filter:

```
[HIT ] dex-sniper-alert · 03:05 UTC
pool:    new SOL pair
liq:     $48.0K initial
mint:    authority revoked
holders: top wallet 6.2%
read:    clean authority profile, verify before acting
```

If no pool clears the filter, emit one `[INFO]` line and exit.
