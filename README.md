<div align="center">

# VIGIL ORACLE

**`VIGIL ORACLE`** · **`$VGL`** · **`Solana`** · **`MIT`**

### The Oracle that never sleeps.

</div>

---

VIGIL ORACLE is an autonomous AI agent framework built for crypto traders.
It runs on a GitHub Actions clock, executes skills written as plain markdown,
and casts structured beacons — whale moves, liquidation cascades, narrative
shifts — straight to your channels while you sleep.

Free, open-source core. `$VGL` holders unlock the premium prophecy skill tier.

## How it works

```
  CRON  ──▶  SCHEDULER  ──▶  SKILL RUNNER  ──▶  OUTPUT
 (every N)   (reads YAML)   (reason + memory)   (telegram/slack)
```

1. **Cron** — GitHub Actions wakes the scheduler on a fixed interval.
2. **Scheduler** — reads each skill's frontmatter, dispatches only what is due.
3. **Skill Runner** — assembles on-chain state plus shared memory, runs one
   reasoning pass, formats the beacon.
4. **Output** — pushes the beacon to Telegram or Slack, then the run exits.

Every run is a public Actions log. Every memory mutation is a git commit.
Nothing is custodial — VIGIL holds no funds and signs no transactions.

## Quick start

```bash
# 1. Fork this repository
# 2. Enable GitHub Actions on your fork (Actions tab → enable workflows)
# 3. Edit vigil.config.yml — set your output channels and toggle skills
# 4. The scheduler runs on its own clock; watch the beacons land
```

No signup, no server to keep alive. Fork it and the watch begins.

## Skills

| Skill | Tier | Description |
|---|---|---|
| `whale-watch` | free | Tracks large wallet transfers and clusters flow by entity. |
| `liquidation-radar` | free | Flags leverage at risk as price nears liquidation bands. |
| `funding-arb` | prophecy | Surfaces funding-rate divergence across perp venues. |
| `narrative-scanner` | free | Detects emerging themes from social and on-chain signal. |
| `kol-tracker` | free | Watches tracked wallets for coordinated entries. |
| `dex-sniper-alert` | prophecy | Catches fresh liquidity pools the moment they open. |
| `unlock-calendar` | free | Warns ahead of token unlocks landing into thin books. |
| `bridge-monitor` | prophecy | Monitors cross-chain bridge flow for unusual movement. |

The free tier runs unrestricted. The `prophecy` tier checks the runner's
wallet for a `$VGL` balance before executing — see the
[whitepaper](https://vigiloracle.xyz/whitepaper.html) for details.

## Writing your own skill

A skill is one markdown file: YAML frontmatter plus a prompt body. Drop a
`SKILL.md` into a new folder under `skills/` and the scheduler discovers it on
the next run. See [`skills/README.md`](skills/README.md) for the full anatomy.

## Links

- **Website** — https://vigiloracle.xyz
- **Whitepaper** — https://vigiloracle.xyz/whitepaper.html
- **X / Twitter** — [@VigilOracle](https://x.com/VigilOracle)
- **Telegram** — https://t.me/vigiloracle

## Contributing

Contributions are welcome. Skills are the easiest entry point — a new skill is
a single markdown file with no SDK to learn. Open a pull request with your
`SKILL.md` and an empty `memory.json`, keep the instructions terse and
domain-specific, and the maintainers will review it for the canon.

Bug reports and runtime improvements are equally welcome. Keep changes small
and the runtime thin — readability is a security property here.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 VIGIL ORACLE
contributors.

<div align="center">

---

*Made with intent in the dark hours.*

</div>

