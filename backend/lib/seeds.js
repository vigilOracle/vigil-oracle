// Static data pools + small helpers shared across the mock generators,
// the Helius wrapper, and the route handlers. Single source of truth.

// Real, well-known Solana mainnet addresses with on-chain activity:
// CEX hot wallets, exchanges, market makers, and DeFi treasuries.
// Used as whale-watch targets and as plausible mock addresses in output.
export const SOLANA_ADDRESSES = [
  // CEX hot wallets (high transfer volume)
  '5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9',
  '2ojv9BAiHUrvsm9gxDe7fJSzbNZSJcxZvf8dqmWGHG8S',
  'H8sMJSCQxfKiFTCfDR3DUMLPwcRbM61LGFJ8N4dK3WjS',
  'BmFdpraQhkiDQE6SnfG5omcA1VwzqfXrwtNYBwWTymy6',
  'AC5RDfQFmDS1deWZos921JfqscXdByf8BKHs5ACWjtW2',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',

  // Major exchanges (proven active in 2024-2026)
  'GJRs4FwHtemZ5ZE9x3FNvJ8TMeCbS3wXTdEPzKQrHmpZ',
  '5xb7BoY7Y9MQXmDpW1WCEgQH7nZ2L1JJrJfTQGqGcyhc',
  'A77HErqtfN1hLLpvZ9pCtu66FEtM8BveoaKbbMoZ4RiR',
  'FxteHmLwG9nk1eL4pjNve3Eub2goGkkz6g6TbvdmW46a',

  // Market makers + high-frequency wallets
  'BUvduFTd2sWFagCunBPLupG8fBTJqweLw9DuhswsjbDb',
  'CRVidEDtLoYf83cXDhgnY7MqQEjL1QqjL5C3vT1jdvxx',
  '6sEk1enayZBGFyNvvJMTP7qs5S3uC7KLrQWaEk38hSHH',

  // DeFi protocol treasuries
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
  'MarBmsSgKXdrN1egZf5sqe1TMThczhMLJhRC8UFydpa',
  '3pMvTLUA9NzZQd4gi725p89mvND1wRNQM3C8XEv1hTdA',
  'GThUX1Atko4tqhN2NaiTazWSeFWMuiUiswQrAHu3p6vd',
  'CFFmoYsiyqgXmRgdcvLEsZJ7XGr5xqfL5uvWfwzGqyXh',
  'JCNCMFXo5M5qwUPg2Utu1u6YWp3MbygxqBsBeXXJfrw',
];

// Subset of SOLANA_ADDRESSES with proven large native-SOL transfer activity.
// whale-watch always queries these so HIT beacons surface reliably — random
// picks across the full pool mostly land on token-moving wallets.
export const WHALE_TARGETS = [
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  'FxteHmLwG9nk1eL4pjNve3Eub2goGkkz6g6TbvdmW46a',
];

// Real, recognizable tickers traders would expect to see.
export const TICKERS = [
  'JUP', 'WIF', 'SOL', 'BONK', 'JTO', 'RAY', 'PYTH', 'PNUT',
  'GOAT', 'MOODENG', 'POPCAT', 'FARTCOIN', 'HYPE', 'AERO', 'ENA',
  'DRIFT', 'KMNO', 'TNSR', 'MEW', 'WEN', 'CLOUD', 'IO',
];

// Plausible crypto-Twitter (X) KOL handles.
export const KOL_HANDLES = [
  '@cobie', '@ansem', '@gainzy222', '@hsakatrades', '@cryptopunk7213',
  '@inversebrah', '@CryptoKaleo', '@HsakaTrades', '@notthreadguy',
  '@0xMert_', '@blknoiz06', '@frankdegods', '@theunipcs',
  '@mooncat2878', '@iamDCinvestor', '@SmallCapScience',
];

// Trending market narratives with a directional flavor.
export const NARRATIVES = [
  'RWA rotation', 'DePIN szn', 'AI agents', 'BTC L2', 'restaking',
  'perp DEX szn', 'stablecoin yield', 'Solana DeFi revival',
  'meme supercycle', 'liquid staking', 'modular blockchains',
  'TON ecosystem',
];

// Chains referenced by the bridge-monitor skill.
export const CHAINS = [
  'Ethereum', 'Solana', 'Arbitrum', 'Base', 'Optimism',
  'Avalanche', 'BNB Chain', 'Sui',
];

// Perp venues referenced by the funding-arb skill.
export const PERP_VENUES = ['Hyperliquid', 'Drift', 'Binance', 'Bybit', 'dYdX'];

// Single source of truth for skill metadata. Consumed by routes/skills.js
// and routes/meta.js so tier/cron/description never drift between them.
export const SKILLS = {
  'whale-watch': {
    tier: 'free',
    cron: '0 */4 * * *',
    description: 'Tracks large SOL transfers across known whale and exchange wallets.',
  },
  'liquidation-radar': {
    tier: 'free',
    cron: '*/15 * * * *',
    description: 'Maps clustered liquidation walls on BTC and ETH perp markets.',
  },
  'funding-arb': {
    tier: 'free',
    cron: '0 */1 * * *',
    description: 'Surfaces funding-rate spreads across major perp venues.',
  },
  'narrative-scanner': {
    tier: 'free',
    cron: '0 */6 * * *',
    description: 'Detects accelerating market narratives and their velocity.',
  },
  'kol-tracker': {
    tier: 'free',
    cron: '*/30 * * * *',
    description: 'Watches influential traders entering new positions.',
  },
  'dex-sniper-alert': {
    tier: 'free',
    cron: '*/5 * * * *',
    description: 'Flags freshly deployed liquidity pools and deployer reputation.',
  },
  'unlock-calendar': {
    tier: 'free',
    cron: '0 8 * * *',
    description: 'Tracks upcoming token unlocks and their supply impact.',
  },
  'bridge-monitor': {
    tier: 'free',
    cron: '0 */2 * * *',
    description: 'Monitors cross-chain capital flows and their direction.',
  },
};

// --- Helpers -------------------------------------------------------------

// Pick one random element from an array.
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Pick n distinct random elements from an array (clamped to array length).
export function pickN(arr, n) {
  const pool = [...arr];
  const out = [];
  const count = Math.min(n, pool.length);
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

// Random integer in [min, max] inclusive.
export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Truncate a 44-char address to the display form: 7xKpL2…q9Fv3R.
export function truncateAddress(addr) {
  if (!addr || addr.length <= 13) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-6)}`;
}

// ISO timestamp at a random point within the last `maxMinsAgo` minutes.
export function recentISO(maxMinsAgo = 240) {
  const msAgo = randomBetween(0, maxMinsAgo) * 60 * 1000;
  return new Date(Date.now() - msAgo).toISOString();
}
