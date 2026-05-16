# Skills

A VIGIL skill is the unit of intelligence in the framework. It is not code —
it is a single markdown file that tells the reasoning engine what to watch and
how to report it. This directory holds the eight free and prophecy skills that
ship with the scaffold; your own skills live here too.

## Anatomy of a skill

Every skill is one `SKILL.md` file with two parts.

**1. YAML frontmatter** — the operational contract, fenced by `---`:

```yaml
---
name: whale-watch          # unique, matches the folder name
tier: free                 # free | prophecy
schedule: "0 */4 * * *"    # standard cron, evaluated in UTC
chains: [solana, ethereum] # networks the skill reads
threshold_usd: 250000      # optional — skill-specific tuning
outputs: [telegram, slack] # channels the beacon is sent to
---
```

**2. Prompt body** — plain English instructions written below the frontmatter.
This is the text the reasoning engine receives each run. Keep it terse and
specific: state what to pull, what to filter, what to flag, and what a beacon
should contain. An `## Output` section at the end shows the expected beacon
format.

## How to write your own

1. Create a folder under `skills/` named for your skill, e.g.
   `skills/my-skill/`.
2. Add a `SKILL.md` with frontmatter and a prompt body.
3. Add an empty `memory.json` containing `{}`.
4. Register the skill in `vigil.config.yml` and set `enabled: true`.
5. Commit. The scheduler discovers the skill on its next run.

There is no SDK, no build step, and no class to subclass. A skill is
reviewable by reading one file — that is the point.

## Memory model

Skills are stateless per run. Anything a skill needs to remember between runs
is written to its `memory.json` and committed to the repository. The next run
reads it back.

- **Namespaced** — each skill owns its own `memory.json`. Skills may read
  another skill's memory (for example, `whale-watch` cross-checks tickers
  against `narrative-scanner`), but they only write their own.
- **Audit trail** — every change to memory is a git commit with a timestamp
  and a diff. The agent's full belief history is reconstructable from git.
- **Bounded** — skills prune their own stale entries each run so files stay
  small and diffs stay readable.

The initial state of every skill is an empty object `{}`.

## Tier system

Skills ship in two tiers:

- **free** — runs unrestricted on every fork. The eight-skill core is free
  and MIT-licensed.
- **prophecy** — checks the runner's wallet for a `$VGL` balance at runtime
  before executing. If the balance clears the threshold, the skill runs;
  otherwise it is skipped for that tick.

The tier is the only difference between the two. The file format, the runtime,
and the public audit trail are identical. Prophecy skills are not hidden — you
can read every `SKILL.md` in this repository — the gate controls execution,
not visibility.
