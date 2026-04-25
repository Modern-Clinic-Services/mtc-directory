#!/usr/bin/env node
/**
 * Refresh the baked directory index inside webflow/directory-page-embed.html
 * by pulling the live items from the Webflow CMS Directory collection.
 *
 * Setup:
 *   export WEBFLOW_API_TOKEN="..."   # CMS read scope is sufficient
 *   node scripts/build-directory-embed.mjs
 *
 * What it does:
 *   1. Pages through GET /collections/<id>/items (100 per page)
 *   2. Builds a tight [name, slug, categorySlug, aliases] tuple per item
 *   3. Replaces the `var INDEX = [...]` literal in webflow/directory-page-embed.html
 *
 * After running, paste the updated embed contents into the Webflow Designer
 * Embed on the /directory page (or re-publish if it's the same Embed instance).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const TOKEN = process.env.WEBFLOW_API_TOKEN;
const COLLECTION_ID = '69ec1ea64d23f0cbe5590856';
const API_BASE = 'https://api.webflow.com/v2';
const EMBED_PATH = path.join(root, 'webflow', 'directory-page-embed.html');
const BUNDLE_PATH = path.join(root, 'dist', 'mtc-directory.js');

// Maps Webflow's capitalized Option label → the lowercase slug used by the embed.
const CATEGORY_LABEL_TO_SLUG = {
  'Condition': 'condition',
  'Symptom': 'symptom',
  'Medication': 'medication',
  'Supplement': 'supplement',
  'Lab or Test': 'lab',
  'Procedure': 'procedure',
  'Concept': 'concept',
};

// Webflow Option fields can return either the label or the option ID depending on the
// endpoint. Resolve via the schema's option-id → label map so either shape works.
const CATEGORY_OPTION_ID_TO_SLUG = {
  'f1c02f1d8bf8afaf76a5ecb9c0292ff0': 'condition',
  'bbe95138f5cd33f860eec3af225a6335': 'symptom',
  '22d7c2b4b5279483c33283d9f62dd5ed': 'medication',
  '9998e33f14aa091786fbb8c0a4a60e84': 'supplement',
  'b5c015dce7b8ca8e97b2af94b8919f7b': 'lab',
  'b02ee4dea7f1d8104f800b71719cf6b3': 'procedure',
  '1deb9855d956e8a918d51167a7a39166': 'concept',
};

if (!TOKEN) {
  console.error('Missing WEBFLOW_API_TOKEN. Get a CMS-read token at');
  console.error('  Webflow Dashboard → Workspace Settings → Integrations → API Access');
  process.exit(1);
}

async function fetchAllItems() {
  const all = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const url = `${API_BASE}/collections/${COLLECTION_ID}/items?limit=${limit}&offset=${offset}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!r.ok) throw new Error(`Webflow API ${r.status}: ${await r.text()}`);
    const j = await r.json();
    const items = j.items || [];
    all.push(...items);
    if (items.length < limit) break;
    offset += limit;
  }
  return all;
}

function categorySlug(raw) {
  if (!raw) return '';
  if (CATEGORY_LABEL_TO_SLUG[raw]) return CATEGORY_LABEL_TO_SLUG[raw];
  if (CATEGORY_OPTION_ID_TO_SLUG[raw]) return CATEGORY_OPTION_ID_TO_SLUG[raw];
  return String(raw).toLowerCase();
}

function buildIndex(items) {
  const tuples = items
    .filter(it => !it.isArchived && !it.isDraft)
    .map(it => {
      const f = it.fieldData || {};
      return [
        f.name || '',
        f.slug || '',
        categorySlug(f.category),
        (f.aliases || '').replace(/\s*,\s*/g, '|').trim(),
      ];
    })
    .filter(t => t[0] && t[1])
    .sort((a, b) => a[0].localeCompare(b[0]));
  return tuples;
}

function replaceIndex(embedSource, indexJson) {
  const marker = /var INDEX = \[[\s\S]*?\];/;
  if (!marker.test(embedSource)) {
    throw new Error('Could not locate `var INDEX = [...]` in the embed file.');
  }
  return embedSource.replace(marker, `var INDEX = ${indexJson};`);
}

(async () => {
  console.log('Fetching directory items from Webflow…');
  const items = await fetchAllItems();
  console.log(`  ${items.length} total items`);

  const index = buildIndex(items);
  console.log(`  ${index.length} usable entries (published, with name + slug)`);

  const indexJson = JSON.stringify(index);
  console.log(`  index size: ${indexJson.length} bytes`);

  const embed = fs.readFileSync(EMBED_PATH, 'utf-8');
  const updated = replaceIndex(embed, indexJson);
  fs.writeFileSync(EMBED_PATH, updated);
  console.log(`Wrote ${EMBED_PATH} (${updated.length} bytes)`);

  // Also rebuild the pure-JS bundle for external CDN hosting.
  const css = updated.match(/<style>([\s\S]*?)<\/style>/)[1];
  const js  = updated.match(/<script>([\s\S]*?)<\/script>/)[1];
  const bundle =
    `/*! MTC directory + search behavior — built from webflow/directory-page-embed.html */\n` +
    `(function(){\n` +
    `  var s = document.createElement('style');\n` +
    `  s.id = 'mtc-directory-styles';\n` +
    `  s.textContent = ${JSON.stringify(css)};\n` +
    `  (document.head || document.documentElement).appendChild(s);\n` +
    `})();\n` +
    js + '\n';
  fs.mkdirSync(path.dirname(BUNDLE_PATH), { recursive: true });
  fs.writeFileSync(BUNDLE_PATH, bundle);
  console.log(`Wrote ${BUNDLE_PATH} (${bundle.length} bytes)`);

  // Category counts for sanity:
  const counts = {};
  for (const t of index) counts[t[2]] = (counts[t[2]] || 0) + 1;
  console.log('Category counts:', counts);
})().catch(e => { console.error(e); process.exit(1); });
