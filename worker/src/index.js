/**
 * MTC Website Directory Update Hook
 *
 * Receives a Webflow webhook on CMS publish, validates the HMAC signature,
 * and fires a `repository_dispatch` event at the GitHub repo so the
 * "Refresh directory bundle" Action runs.
 *
 * Required secrets (wrangler secret put …):
 *   WEBFLOW_WEBHOOK_SECRET  — same value you configure on the Webflow webhook
 *   GITHUB_PAT              — fine-grained PAT with Contents:write on the repo
 */

const REPO = 'Modern-Clinic-Services/mtc-directory';
const EVENT_TYPE = 'webflow_changed';
const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'GET') {
      return new Response('mtc-website-directory-update-hook is alive\n', { status: 200 });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const rawBody = await request.text();
    const sigHeader = request.headers.get('x-webflow-signature') || '';
    const tsHeader = request.headers.get('x-webflow-timestamp') || '';

    if (!sigHeader || !tsHeader) {
      return new Response('Missing signature headers', { status: 401 });
    }

    const ts = Number(tsHeader);
    if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > TIMESTAMP_TOLERANCE_MS) {
      return new Response('Stale or invalid timestamp', { status: 401 });
    }

    const expected = await hmacSha256Hex(env.WEBFLOW_WEBHOOK_SECRET, `${tsHeader}:${rawBody}`);
    if (!constantTimeEqual(sigHeader, expected)) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Optional: only act on CMS-related events to avoid unnecessary rebuilds.
    // Webflow sends triggerType in the JSON body, e.g. "collection_item_created",
    // "collection_item_changed", "collection_item_deleted", "site_publish".
    let payload;
    try { payload = JSON.parse(rawBody); } catch { payload = {}; }
    const trigger = payload?.triggerType || '';
    const directoryCollectionId = '69ec1ea64d23f0cbe5590856';

    const collectionId = payload?.payload?.collectionId || payload?.collectionId;
    const isRelevant =
      trigger === 'site_publish' ||
      trigger === 'site_publishing' ||
      ((trigger === 'collection_item_created' ||
        trigger === 'collection_item_changed' ||
        trigger === 'collection_item_updated' ||
        trigger === 'collection_item_deleted' ||
        trigger === 'collection_item_unpublished') &&
        (!collectionId || collectionId === directoryCollectionId));

    if (!isRelevant) {
      console.log('ignored', { trigger, collectionId });
      return new Response(`Ignored: ${trigger || 'unknown'} / collection: ${collectionId || 'unknown'}`, { status: 200 });
    }
    console.log('dispatching', { trigger });

    const ghRes = await fetch(`https://api.github.com/repos/${REPO}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_PAT}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'mtc-website-directory-update-hook',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: EVENT_TYPE,
        client_payload: {
          trigger,
          itemId: payload?.payload?.id ?? null,
          collectionId: payload?.payload?.collectionId ?? null,
          dispatchedAt: new Date().toISOString(),
        },
      }),
    });

    if (!ghRes.ok) {
      const errText = await ghRes.text();
      return new Response(`GitHub dispatch failed: ${ghRes.status} ${errText}`, { status: 502 });
    }

    return new Response(`Dispatched (${trigger})`, { status: 200 });
  },
};

async function hmacSha256Hex(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const bytes = new Uint8Array(sig);
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return hex;
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
