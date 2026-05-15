// Helius Enhanced Transactions API wrapper for the whale-watch skill.
// Scans recent parsed transactions on a set of seeded whale/exchange
// addresses and surfaces native SOL transfers above a USD threshold.

import { WHALE_TARGETS, truncateAddress } from './seeds.js';

// Hardcoded SOL price — keeps threshold math simple, no extra network hop.
const SOL_USD = 140;
const WHALE_THRESHOLD_USD = 50_000;
const LAMPORTS_PER_SOL = 1_000_000_000;
// Helius' free tier can be slow on cold calls; 2s is too tight to ever return
// live data, so we allow more headroom while still failing fast.
const FETCH_TIMEOUT_MS = 3500;
// Gap between sequential requests — the free tier rate-limits concurrent
// bursts, which would drop exactly the whale data we need.
const REQUEST_GAP_MS = 250;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Extract the api-key from HELIUS_RPC_URL and build the Enhanced Tx API base.
// Throws if the key is missing — caller falls back to mock data.
function enhancedApiUrl(address) {
  const rpcUrl = process.env.HELIUS_RPC_URL;
  if (!rpcUrl) throw new Error('HELIUS_RPC_URL not set');

  let apiKey;
  try {
    apiKey = new URL(rpcUrl).searchParams.get('api-key');
  } catch {
    throw new Error('HELIUS_RPC_URL is malformed');
  }
  if (!apiKey || apiKey === 'YOUR_KEY') {
    throw new Error('HELIUS_RPC_URL has no usable api-key');
  }

  return `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${apiKey}&limit=25`;
}

// Fetch parsed transactions for one address with a hard 2s timeout.
async function fetchAddressTxs(address) {
  const res = await fetch(enhancedApiUrl(address), {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Helius responded ${res.status}`);
  return res.json();
}

// Inspect the live whale-target addresses for large native SOL transfers.
// Returns { beacons, summary }. Throws on any network/HTTP/timeout error so
// the route handler can fall back to mock_fallback.
export async function getWhaleTransfers() {
  // Query the proven whale wallets sequentially with a short gap. Parallel
  // requests get rate-limited by the free tier; one failed address can't sink
  // the call — as long as any resolves, it still counts as live data.
  const ok = [];
  let lastError;
  for (let i = 0; i < WHALE_TARGETS.length; i++) {
    try {
      ok.push(await fetchAddressTxs(WHALE_TARGETS[i]));
    } catch (err) {
      lastError = err;
    }
    if (i < WHALE_TARGETS.length - 1) await sleep(REQUEST_GAP_MS);
  }
  if (ok.length === 0) {
    throw new Error(`all Helius queries failed: ${lastError?.message || lastError}`);
  }

  const hits = [];
  for (const txs of ok) {
    if (!Array.isArray(txs)) continue;
    for (const tx of txs) {
      for (const transfer of tx.nativeTransfers || []) {
        const sol = (transfer.amount || 0) / LAMPORTS_PER_SOL;
        const valueUsd = sol * SOL_USD;
        if (valueUsd < WHALE_THRESHOLD_USD) continue;
        hits.push({
          valueUsd,
          sol,
          from: transfer.fromUserAccount,
          to: transfer.toUserAccount,
          timestamp: tx.timestamp
            ? new Date(tx.timestamp * 1000).toISOString()
            : new Date().toISOString(),
        });
      }
    }
  }

  // Largest transfers first, cap at 3 beacons.
  hits.sort((a, b) => b.valueUsd - a.valueUsd);
  const top = hits.slice(0, 3);

  if (top.length === 0) {
    return {
      beacons: [
        {
          level: 'INFO',
          message: 'No whale-scale SOL flows detected across watched wallets.',
          timestamp: new Date().toISOString(),
        },
      ],
      summary: 'Watched wallets quiet — no transfers above the $50k threshold.',
    };
  }

  const beacons = top.map((hit) => ({
    level: 'HIT',
    message: `Large SOL transfer — ${hit.sol.toFixed(1)} SOL (~$${(hit.valueUsd / 1_000_000).toFixed(2)}M) moved`,
    address: truncateAddress(hit.from || hit.to),
    flow: `${truncateAddress(hit.from)} → ${truncateAddress(hit.to)}`,
    asset: 'SOL',
    timestamp: hit.timestamp,
  }));

  return {
    beacons,
    summary: `${top.length} whale-scale SOL transfer${top.length > 1 ? 's' : ''} confirmed on-chain.`,
  };
}
