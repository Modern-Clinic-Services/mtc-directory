#!/usr/bin/env node
/**
 * Merges all per-entry JSON files from content/entries/ + the reference entry
 * with the master terms-index.json to produce data/terms.json — the single
 * source of truth that feeds Webflow imports.
 *
 * Usage: node scripts/merge-entries.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const INDEX = path.join(root, 'data', 'terms-index.json');
const ENTRIES_DIR = path.join(root, 'content', 'entries');
const REFERENCE = path.join(root, 'content', '_reference-entry.json');
const OUT = path.join(root, 'data', 'terms.json');

const firstLetter = (name) => name.replace(/^[^A-Za-z]+/, '').charAt(0).toUpperCase();

const categoryMap = {
  condition: 'Condition',
  symptom: 'Symptom',
  medication: 'Medication',
  supplement: 'Supplement',
  lab: 'Lab or Test',
  procedure: 'Procedure',
  concept: 'Concept'
};

const indexData = JSON.parse(fs.readFileSync(INDEX, 'utf-8'));
const reference = JSON.parse(fs.readFileSync(REFERENCE, 'utf-8'));

// Map slug -> authored content
const authored = new Map();
authored.set(reference.slug, reference);

if (fs.existsSync(ENTRIES_DIR)) {
  for (const file of fs.readdirSync(ENTRIES_DIR)) {
    if (!file.endsWith('.json')) continue;
    try {
      const content = JSON.parse(fs.readFileSync(path.join(ENTRIES_DIR, file), 'utf-8'));
      if (content.slug) authored.set(content.slug, content);
    } catch (err) {
      console.warn(`Skipped malformed file: ${file} (${err.message})`);
    }
  }
}

const terms = [];
const missing = [];

for (const term of indexData.terms) {
  const c = authored.get(term.slug);
  if (!c) {
    missing.push(term.slug);
    continue;
  }
  terms.push({
    id: term.id,
    name: term.name,
    slug: term.slug,
    category: categoryMap[term.category] || term.category,
    firstLetter: firstLetter(term.name),
    aliases: (term.aliases || []).join(', '),
    treatedAtMTC: !!term.treatedAtMTC,
    featured: !!term.featured,
    seedRelated: term.seedRelated || [],
    shortDefinition: c.shortDefinition,
    fullDefinition: c.fullDefinition,
    commonQuestions: c.commonQuestions || [],
    keySymptoms: c.keySymptoms || [],
    seoTitle: c.seoTitle,
    seoDescription: c.seoDescription
  });
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({
  version: indexData.version,
  lastUpdated: new Date().toISOString(),
  totalTerms: terms.length,
  terms
}, null, 2));

console.log(`Wrote ${terms.length} terms to ${OUT}`);
if (missing.length) {
  console.log(`\nMISSING authored content for ${missing.length} term(s):`);
  for (const m of missing) console.log(`  - ${m}`);
}
