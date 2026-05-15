// Beacon generators for the 7 mock skills (plus a whale-watch fallback).
// Each generator returns { beacons, summary } with randomized counts and
// values so repeated calls produce organic-feeling output for the frontend
// live terminal.

import {
  SOLANA_ADDRESSES,
  TICKERS,
  KOL_HANDLES,
  NARRATIVES,
  CHAINS,
  PERP_VENUES,
  pickRandom,
  pickN,
  randomBetween,
  truncateAddress,
  recentISO,
} from './seeds.js';

// Format a USD amount into a compact human string ($1.4M, $320k).
function usd(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(amount / 1000)}k`;
}

// Build a single beacon, defaulting the timestamp to a recent ISO.
function beacon(level, message, extra = {}) {
  return { level, message, timestamp: recentISO(180), ...extra };
}

// --- whale-watch fallback ------------------------------------------------
// Used when the real Helius call fails or times out.
export function whaleWatchMock() {
  const count = randomBetween(1, 3);
  const beacons = [];
  for (let i = 0; i < count; i++) {
    const addr = pickRandom(SOLANA_ADDRESSES);
    const amount = randomBetween(250, 5000) * 1000;
    const inflow = Math.random() < 0.5;
    beacons.push(
      beacon('HIT', `Large SOL transfer detected — ${usd(amount)} moved`, {
        address: truncateAddress(addr),
        flow: inflow ? 'inflow → exchange' : 'outflow → cold wallet',
        asset: 'SOL',
      })
    );
  }
  return {
    beacons,
    summary: `${count} whale-scale SOL transfer${count > 1 ? 's' : ''} observed in the last window.`,
  };
}

// --- liquidation-radar ---------------------------------------------------
export function liquidationRadar() {
  const assets = ['BTC', 'ETH'];
  const beacons = assets.map((asset) => {
    const side = Math.random() < 0.5 ? 'long' : 'short';
    const wall = randomBetween(40, 200) * 1_000_000;
    const price = asset === 'BTC' ? randomBetween(58, 72) * 1000 : randomBetween(2800, 3900);
    return beacon(
      'WARN',
      `${asset} ${side} liquidation wall — ${usd(wall)} clustered near $${price.toLocaleString()}`,
      { asset }
    );
  });
  return {
    beacons,
    summary: 'Liquidation pressure mapped on BTC and ETH perp books.',
  };
}

// --- funding-arb ---------------------------------------------------------
export function fundingArb() {
  const count = randomBetween(1, 2);
  const beacons = [];
  for (let i = 0; i < count; i++) {
    const [venueA, venueB] = pickN(PERP_VENUES, 2);
    const asset = pickRandom(['BTC', 'ETH', 'SOL']);
    const spread = (Math.random() * 0.08 + 0.01).toFixed(3);
    beacons.push(
      beacon(
        'HIT',
        `${asset} funding spread ${spread}% — long ${venueA} / short ${venueB}`,
        { asset }
      )
    );
  }
  return {
    beacons,
    summary: `${count} funding-rate arbitrage window${count > 1 ? 's' : ''} open across perp venues.`,
  };
}

// --- narrative-scanner ---------------------------------------------------
export function narrativeScanner() {
  const narrative = pickRandom(NARRATIVES);
  const velocity = (Math.random() * 3.5 + 1.2).toFixed(1);
  return {
    beacons: [
      beacon('HIT', `Narrative accelerating — "${narrative}" at ${velocity}× velocity`),
    ],
    summary: `"${narrative}" is the fastest-moving narrative this cycle.`,
  };
}

// --- kol-tracker ---------------------------------------------------------
export function kolTracker() {
  const count = randomBetween(2, 3);
  const handles = pickN(KOL_HANDLES, count);
  const beacons = handles.map((handle) => {
    const ticker = pickRandom(TICKERS);
    const conviction = randomBetween(55, 98);
    return beacon('HIT', `${handle} entered $${ticker} — conviction score ${conviction}/100`, {
      asset: ticker,
    });
  });
  return {
    beacons,
    summary: `${count} tracked traders opened fresh positions.`,
  };
}

// --- dex-sniper-alert ----------------------------------------------------
export function dexSniperAlert() {
  const count = randomBetween(1, 2);
  const beacons = [];
  for (let i = 0; i < count; i++) {
    const ticker = pickRandom(TICKERS);
    const lp = randomBetween(15, 480) * 1000;
    const rep = pickRandom(['clean', 'unverified', 'flagged — prior rug', 'serial deployer']);
    beacons.push(
      beacon('WARN', `New pool live — $${ticker} / SOL · LP ${usd(lp)} · deployer: ${rep}`, {
        address: truncateAddress(pickRandom(SOLANA_ADDRESSES)),
        asset: ticker,
      })
    );
  }
  return {
    beacons,
    summary: `${count} freshly deployed pool${count > 1 ? 's' : ''} flagged for review.`,
  };
}

// --- unlock-calendar -----------------------------------------------------
export function unlockCalendar() {
  const ticker = pickRandom(TICKERS);
  const daysOut = randomBetween(2, 21);
  const supplyPct = (Math.random() * 8 + 0.5).toFixed(1);
  const unlockDate = new Date(Date.now() + daysOut * 86400000)
    .toISOString()
    .slice(0, 10);
  return {
    beacons: [
      beacon(
        'WARN',
        `$${ticker} unlock on ${unlockDate} — ${supplyPct}% of circulating supply hits market`,
        { asset: ticker }
      ),
    ],
    summary: `$${ticker} faces a ${supplyPct}% supply unlock in ${daysOut} days.`,
  };
}

// --- bridge-monitor ------------------------------------------------------
export function bridgeMonitor() {
  const count = randomBetween(1, 2);
  const beacons = [];
  for (let i = 0; i < count; i++) {
    const [from, to] = pickN(CHAINS, 2);
    const volume = randomBetween(800, 22000) * 1000;
    beacons.push(
      beacon('INFO', `Cross-chain flow — ${usd(volume)} bridged ${from} → ${to}`, {
        flow: `${from} → ${to}`,
      })
    );
  }
  return {
    beacons,
    summary: `${count} notable cross-chain flow${count > 1 ? 's' : ''} settled this window.`,
  };
}

// Lookup table so routes can resolve a skill name to its generator.
export const MOCK_GENERATORS = {
  'liquidation-radar': liquidationRadar,
  'funding-arb': fundingArb,
  'narrative-scanner': narrativeScanner,
  'kol-tracker': kolTracker,
  'dex-sniper-alert': dexSniperAlert,
  'unlock-calendar': unlockCalendar,
  'bridge-monitor': bridgeMonitor,
};
