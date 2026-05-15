# VIGIL ORACLE — Project Guide

## What
VIGIL ORACLE ($VGL) is an autonomous AI agent framework for crypto traders.
Inspired by AEON's architecture: GitHub Actions runtime, markdown skills,
self-evolving. Specialized for trading intelligence (whale-watch, liquidation
radar, narrative scanner, KOL tracker, on-chain anomalies, pre-market hunting).

Free open-source core. $VGL holders unlock premium "prophecy" skills.

## Tagline
"The Oracle that never sleeps."

## Visual Identity
- Aesthetic: Premium fintech (Keytom-grade), editorial, dark + warm amber
- Motif: Lighthouse beacon — amber light cutting through dark night
- Mood: Serious, trustworthy, oracle-like, ancient-meets-modern

## Color Palette
- --bg: #0A0A0B           (near-black base)
- --bg-elev: #131316      (elevated surfaces)
- --border: #1F1F23       (subtle dividers)
- --text: #F5F5F0         (off-white primary)
- --text-dim: #8B8B85     (secondary)
- --amber: #FFB347        (primary accent)
- --amber-bright: #FFC857 (hover/highlight)
- --amber-deep: #D4881F   (shadow/depth)
- --ember: #FF6B1A        (CTA emphasis)

## Typography
- Headlines: Instrument Serif (italic for emphasis), large, tight tracking
- Body: Inter, 400/500, comfortable line-height
- Code/Data: JetBrains Mono — for ticker symbols, addresses, numbers, terminal

## Layout Rules
- Generous whitespace (Keytom-style — content breathes)
- Max content width: ~1200px, centered
- Section padding: 120px top/bottom on desktop
- Border radius: 12px on cards, 8px on buttons (NOT brutalist, soft premium)
- Subtle shadows with amber tints

## Animation Rules
- Lenis smooth scroll everywhere (default)
- GSAP ScrollTrigger for section reveals: y(40px) → 0, opacity 0 → 1, stagger
- Hero: subtle parallax on background beacon
- Number counters animate when in view
- Hover: scale(1.02) + amber glow on accents
- NO bouncy/playful easings — use power2.out or expo.out
- All transitions: 0.4s–0.8s, never instant

## Content Tone
- English (public-facing)
- Authoritative, oracular, slightly mystical-but-grounded
- Short sentences. Strong verbs.

## Stack
- Frontend: HTML/CSS/JS single-page (no React/framework). GSAP + Lenis via CDN.
- Backend: Node.js + Fastify, deployable to Railway
- Token: pump.fun (Solana). Manual TBA find-replace for CA.

## CA Convention
Single `const CA = 'TBA'` at top of every HTML/JS file.
On launch: Ctrl+H replace 'TBA' with real Solana address.

## Skill Naming
- whale-watch, liquidation-radar, funding-arb, narrative-scanner
- kol-tracker, dex-sniper-alert, unlock-calendar, bridge-monitor
- prophecy-* for premium/$VGL-gated skills

## DO NOT
- Use rounded brutalist borders (this is premium, not playful)
- Use emojis as primary visual elements
- Mention "Claude" or any AI tool in user-facing content
- Add stock-photo placeholders — use CSS/SVG art
- Use heavy gradients — keep amber accents tight & purposeful

## Density Requirements (STRICT)
- LONG-SCROLL site, 16 sections minimum, AEON/Linear/Resend tier density
- Every section must have multiple sub-elements (heading + paragraph alone = FAIL)
- Aim: index.html ~1000-1400 lines, style.css ~3500-5000 lines, script.js ~500-700 lines
- "Minimal" = wrong. "Simple" = wrong. "Premium dense" = right.

## Visual Density Techniques (use throughout)
- Subtle 1px dotted grid background overlay on dark sections
- SVG noise/grain filter overlay (turbulence) on major sections
- Multi-layer glows: 3+ stacked box-shadows on amber accents
- Decorative corner brackets [+] on hero, cards, terminals
- Bracket numbered labels: [01] WHALE-WATCH, [02] LIQUIDATION-RADAR
- Monospace ticker numbers everywhere (timestamps, counts, addresses)
- Subtle scan-lines (1px repeating gradient) on terminal mockups
- Decorative dividers between sections (ASCII line: ────────── or dotted)

## Image Assets Available
- frontend/assets/hero-lighthouse.png — cinematic lighthouse photo with amber beam, dramatic dark mood. USE AS HERO BACKGROUND (full-bleed, with dark gradient overlay for text readability). Lighthouse positioned left-center, negative space on right for headline overlay.
- frontend/assets/bg-texture.png — cosmic amber-on-black nebula texture. USE SPARINGLY: as decorative overlay on 1-2 dramatic sections (suggest: Final CTA section, or as subtle hero parallax layer at opacity 0.2 with mix-blend-mode screen). DO NOT tile or repeat.

## Required Sections (in order, all 16)
1. Top status bar — slim monospace strip: "VIGIL ORACLE · v0.1.0 · STATUS: WATCHING · LAST BEACON: 03:47 UTC · 1,247 AGENTS ACTIVE" (auto-update timestamp via JS)
2. Nav — sticky blur, logo + Skills/Tokenomics/Docs/Roadmap + amber CTA
3. Hero — FULL BLEED hero-lighthouse.png background, dark gradient overlay (0% from right to 70% black from left), headline overlay on right side: "The Oracle / that never sleeps" (Instrument Serif, massive, italic emphasis), subhead, 2 CTAs, small "STATUS: WATCHING" indicator with pulsing amber dot, scroll-hint chevron at bottom
4. Marquee ticker — infinite scrolling horizontal: skill names with [+] separators (whale-watch + liquidation-radar + funding-arb + ... cycling), JetBrains Mono, amber on dark
5. Stats bar — 4 stat cards (Agents Active: 1,247 · Prophecies Cast: 38,492 · Watch Hours: 144,512 · Skills Available: 32), all with animated count-up, mono numbers, label below in caps
6. "Watch the depths" — section [01] WHY VIGIL, headline, 3 detailed feature columns (Autonomous · Composable · Token-gated) each with: title, 2-paragraph copy, mini SVG diagram, "Learn more →" link
7. "Anatomy of a skill" — section [02] HOW SKILLS WORK, split-pane terminal mockup. Left pane: actual whale-watch SKILL.md content with YAML frontmatter and markdown body (real-looking, full, syntax highlighted). Right pane: execution log output (timestamps, [INFO]/[WARN] tags, found whale tx with mock Solana address, summary). Both panes monospace, dark elevated bg with scan-lines.
8. "Skills compose" — section [03] SKILL LIBRARY, grid of 8 cards EACH with: bracket number, skill-name in mono, FREE/PROPHECY tag, 2-line description, example trigger ("Runs every 4h"), example output snippet (1-2 lines mono), cron schedule indicator. Cards have corner brackets [+] decoration.
9. "Three steps" — section [04] HOW VIGIL WORKS, 3 step cards stacked vertically (DROP horizontal pin, was buggy), each step has: step number, title (Fork → Configure → Watch), description paragraph, code snippet (bash command for step 1, YAML for step 2, terminal output for step 3), animated reveal
10. Architecture diagram — section [05] SYSTEM DESIGN, ASCII-art diagram in monospace centered showing flow: GitHub Actions cron → Scheduler → Skill Runner → Claude → Skills/Memory → Output (Telegram/Discord/Slack). Use actual ASCII box-drawing characters (┌─┐ │ └─┘ ↓ →). Caption below explaining.
11. Live terminal demo — section [06] LIVE EXECUTION, single fake terminal that cycles through 5 different skill outputs (whale-watch, liquidation-radar, funding-arb, etc), each fade in/out, with realistic timestamps, log levels, mock addresses, completing with "Beacon sent · 03:47:12"
12. Tokenomics — section [07] THE $VGL TOKEN, headline, utility paragraph, 3 stat boxes (Total Supply 1,000,000,000 with animated counter / Distribution: 95% fair launch + 5% locked dev with horizontal bar viz / Holder utility: prophecy skill access). Real numbers.
13. Comparison table — section [08] WHY $VGL, 4-column comparison table: VIGIL vs Aeon (general agent) vs Centralized bots (3Commas-like) vs Manual trading. 6 rows of criteria (Cost, Customization, Privacy, Speed, Edge skills, Self-evolving). Checkmarks/X marks with amber for VIGIL column highlight.
14. Roadmap — section [09] ROADMAP, 4-column quarterly grid (Q2 2026 / Q3 2026 / Q4 2026 / 2027+), each with 3-5 bullet points and "shipped"/"in progress"/"planned" status indicators. Real-feeling milestones (skill marketplace, mobile companion app, prophecy DAO, etc).
15. FAQ — section [10] QUESTIONS, 8 expandable Q&A items with REAL answers (no lorem). Questions like: "How is this different from Aeon?", "Why do I need $VGL?", "Can I run VIGIL without a Claude subscription?", "Is the prophecy data accurate?", "What's the gas cost?", "Can I write my own skills?", "Is the code audited?", "What chains do you support?"
16. Final CTA — bg-texture.png subtle overlay, massive Instrument Serif "Stand watch / with us", launch date "TBA · launching on pump.fun · be the first watcher", LARGE amber CTA button linking to pump.fun (placeholder with CA), contract display block
17. Footer — rich 4-column footer: Brand column (logo + tagline + status indicator) · Product (Skills, Tokenomics, Docs, Roadmap) · Community (X, GitHub, Telegram, Discord) · Legal (Privacy, Terms, Disclaimer) + bottom strip with copyright and "Made with intent in the dark hours"

## Dev Aesthetic Rules (mandatory)
- Section labels: [01] WATCH THE DEPTHS (uppercase, JetBrains Mono, amber-deep color, letter-spacing 0.2em)
- All numbers in JetBrains Mono with thin amber underline
- Terminal mockups: bg #0F0F12, mono font, syntax tokens (amber strings, dim grey comments, white keywords)
- Code blocks use real plausible YAML/Markdown/Bash content (NEVER placeholder)
- ASCII diagrams: actual functional art with proper box-drawing chars
- Corner brackets on featured cards: small [+] in 4 corners with amber color

## Forbidden
- Lorem ipsum, placeholder text, "coming soon" without context
- Generic stock-feeling sections
- Empty filler — every section earns its place
