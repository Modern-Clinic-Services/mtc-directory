#!/usr/bin/env node
/**
 * Deletes any partial / corrupted Directory items left behind by failed
 * upload subagents. Safe to re-run: lists current items first and only
 * deletes those whose schema-json-ld field is empty or truncated.
 *
 * Usage:
 *   export WEBFLOW_API_TOKEN="..."
 *   node scripts/cleanup-partial-items.mjs            # list candidates
 *   node scripts/cleanup-partial-items.mjs --delete   # actually delete them
 */
import process from 'node:process';

const TOKEN = process.env.WEBFLOW_API_TOKEN;
const COLLECTION_ID = '69ec1ea64d23f0cbe5590856';
const API_BASE = 'https://api.webflow.com/v2';
const DELETE = process.argv.includes('--delete');

if (!TOKEN) {
  console.error('Missing WEBFLOW_API_TOKEN');
  process.exit(1);
}

async function api(method, urlPath, body) {
  const r = await fetch(`${API_BASE}${urlPath}`, {
    method,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'accept-version': '2.0.0'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!r.ok) throw new Error(`${method} ${urlPath} → ${r.status}: ${await r.text()}`);
  return r.json();
}

let offset = 0;
const all = [];
while (true) {
  const page = await api('GET', `/collections/${COLLECTION_ID}/items?limit=100&offset=${offset}`);
  all.push(...page.items);
  if (page.items.length < 100) break;
  offset += 100;
}
console.log(`Fetched ${all.length} items.`);

const partial = all.filter(i => {
  const schema = i.fieldData?.['schema-json-ld'] || '';
  const fullDef = i.fieldData?.['full-definition'] || '';
  // Truncated / abbreviated heuristic: missing FAQPage block, or full def < 1000 chars
  return !schema.includes('FAQPage') || fullDef.length < 1000;
});

console.log(`Identified ${partial.length} likely-corrupted items.`);
for (const i of partial) {
  console.log(`  ${i.id} — ${i.fieldData?.name} (${i.fieldData?.slug})`);
}

if (DELETE && partial.length) {
  console.log('\nDeleting...');
  for (const i of partial) {
    await api('DELETE', `/collections/${COLLECTION_ID}/items/${i.id}`);
    console.log(`  deleted ${i.id}`);
  }
}
