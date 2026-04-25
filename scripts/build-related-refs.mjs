#!/usr/bin/env node
/**
 * After all CMS items have been created, this script builds the second-pass
 * update payload that links Related Terms via MultiReference.
 *
 * Input: webflow/live-items.json — array of { id, fieldData: { slug, name } } captured
 *        from Webflow after items are created (list_collection_items response).
 *        Expected shape: { items: [ { id, fieldData: { slug, ... } } ] }
 * Input: webflow/item-manifest.json (from build-payload.mjs)
 *
 * Output: webflow/related-updates.json — payload ready for update_collection_items.
 *
 * Usage: node scripts/build-related-refs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const OUT_DIR = path.join(root, 'webflow');

const live = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'live-items.json'), 'utf-8'));
const manifest = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'item-manifest.json'), 'utf-8')).manifest;

const slugToId = new Map();
for (const item of (live.items || live)) {
  const slug = item.fieldData?.slug || item.slug;
  if (slug) slugToId.set(slug, item.id);
}

const updates = [];
for (const entry of manifest) {
  const id = slugToId.get(entry.slug);
  if (!id) continue;
  const relatedIds = entry.seedRelated
    .map(s => slugToId.get(s))
    .filter(Boolean)
    .slice(0, 8); // cap at 8 per entry
  if (!relatedIds.length) continue;
  updates.push({
    id,
    fieldData: {
      name: entry.name,
      slug: entry.slug,
      'related-terms': relatedIds
    }
  });
}

fs.writeFileSync(path.join(OUT_DIR, 'related-updates.json'), JSON.stringify({
  items: updates
}, null, 2));
console.log(`Built ${updates.length} related-terms update records.`);
console.log(`Wrote ${path.relative(root, path.join(OUT_DIR, 'related-updates.json'))}`);
