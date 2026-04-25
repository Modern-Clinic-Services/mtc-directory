#!/usr/bin/env node
/**
 * Converts data/terms.json into batched Webflow CMS item create payloads,
 * each batch <= 100 items (Webflow API limit).
 *
 * Also converts Markdown fullDefinition + commonQuestions to HTML suitable
 * for Webflow RichText fields, and rewrites [slug] interlinks into
 * <a href="/directory/{slug}"> tags.
 *
 * Generates FAQPage + DefinedTerm + MedicalEntity JSON-LD per entry.
 *
 * Output: webflow/import-payload.json with { batches: [ { items: [...] } ] }
 *         webflow/item-manifest.json  (slug -> payload index, for second-pass reference linking)
 *
 * Usage: node scripts/build-payload.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const TERMS = path.join(root, 'data', 'terms.json');
const OUT_DIR = path.join(root, 'webflow');

const SITE_BASE = 'https://www.modernthyroidclinic.com';
const DIRECTORY_PATH = '/directory';

const data = JSON.parse(fs.readFileSync(TERMS, 'utf-8'));
const termSlugs = new Set(data.terms.map(t => t.slug));

// --- Markdown -> HTML (minimal, handles what writers produce) ---
function mdToHtml(md) {
  if (!md) return '';
  const lines = md.split('\n');
  const out = [];
  let inList = false;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      if (inList) { out.push('</ul>'); inList = false; }
      const level = Math.min(6, h[1].length + 1); // shift so ## becomes h3 (h2 reserved for page title)
      // Actually keep H2/H3 as-is in markdown - let's preserve the literal level
      const literalLevel = h[1].length;
      out.push(`<h${literalLevel}>${inline(h[2])}</h${literalLevel}>`);
      continue;
    }

    // Lists
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inline(li[1])}</li>`);
      continue;
    }

    if (inList) { out.push('</ul>'); inList = false; }

    if (line.trim() === '') {
      out.push('');
      continue;
    }

    out.push(`<p>${inline(line)}</p>`);
  }
  if (inList) out.push('</ul>');
  return out.join('\n');
}

function inline(s) {
  // **bold**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // *italic*
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  // [slug] interlinks — only rewrite if slug is a real term slug
  s = s.replace(/\[([a-z0-9-]+)\]/g, (match, slug) => {
    if (termSlugs.has(slug)) {
      return `<a href="${DIRECTORY_PATH}/${slug}">${prettySlug(slug)}</a>`;
    }
    return match;
  });
  return s;
}

function prettySlug(slug) {
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function faqHtml(questions) {
  if (!questions || !questions.length) return '';
  return questions.map(q => (
    `<div class="faq-item"><h3>${escapeHtml(q.q)}</h3><p>${escapeHtml(q.a)}</p></div>`
  )).join('\n');
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function makeSchemaJsonLd(term) {
  const url = `${SITE_BASE}${DIRECTORY_PATH}/${term.slug}`;
  const blocks = [];

  // DefinedTerm
  blocks.push({
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.name,
    alternateName: term.aliases ? term.aliases.split(',').map(a => a.trim()).filter(Boolean) : undefined,
    description: term.shortDefinition,
    inDefinedTermSet: `${SITE_BASE}${DIRECTORY_PATH}`,
    url
  });

  // MedicalEntity for conditions/symptoms/meds/labs/procedures
  if (['Condition', 'Symptom', 'Medication', 'Lab or Test', 'Procedure'].includes(term.category)) {
    const t = term.category === 'Condition' ? 'MedicalCondition'
            : term.category === 'Symptom'   ? 'MedicalSignOrSymptom'
            : term.category === 'Medication' ? 'Drug'
            : term.category === 'Lab or Test' ? 'MedicalTest'
            : 'MedicalProcedure';
    blocks.push({
      '@context': 'https://schema.org',
      '@type': t,
      name: term.name,
      description: term.shortDefinition,
      url,
      ...(term.keySymptoms && term.keySymptoms.length
        ? { signOrSymptom: term.keySymptoms.map(s => ({ '@type': 'MedicalSignOrSymptom', name: s })) }
        : {})
    });
  }

  // FAQPage
  if (term.commonQuestions && term.commonQuestions.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: term.commonQuestions.map(q => ({
        '@type': 'Question',
        name: q.q,
        acceptedAnswer: { '@type': 'Answer', text: q.a }
      }))
    });
  }

  return blocks.map(b => `<script type="application/ld+json">${JSON.stringify(b, null, 2)}</script>`).join('\n');
}

// Category option IDs from the Webflow collection schema (captured from API response)
const CATEGORY_IDS = {
  'Condition':   'f1c02f1d8bf8afaf76a5ecb9c0292ff0',
  'Symptom':     'bbe95138f5cd33f860eec3af225a6335',
  'Medication':  '22d7c2b4b5279483c33283d9f62dd5ed',
  'Supplement':  '9998e33f14aa091786fbb8c0a4a60e84',
  'Lab or Test': 'b5c015dce7b8ca8e97b2af94b8919f7b',
  'Procedure':   'b02ee4dea7f1d8104f800b71719cf6b3',
  'Concept':     '1deb9855d956e8a918d51167a7a39166'
};
const FIRST_LETTER_IDS = {
  A:'e88ba0392b8257ecc38e8163b5843e37', B:'0e89b469108f988d53b3d9133cf983d7',
  C:'5ad918252eb1778d658e2eed6924a565', D:'9ca36aaf6fa9ff90a096bfaf04641492',
  E:'3d368474596dfe84797901a95acb6d30', F:'579eb30b8623d34838b914f19d0fb4e8',
  G:'c0d16a20e13617e578a56587a93cb182', H:'241aa8d0107609382f569c50b3c1f17b',
  I:'258bdfad964d0a71d2a9c813e9de23e0', J:'dfb050f4182ade6bb76e62354fb2568a',
  K:'1be09d0c531563716b21af58e82a7d37', L:'8443073647095f6bb800335a5ba794f1',
  M:'8d3d503af9052e7071274b4e036983b5', N:'b3fd34f3f1626e53979028fc89f759ac',
  O:'2c6b2a07c25bb573b1ea73156b3ebbd6', P:'05141d66a42d3c94d774194ba6a6c76a',
  Q:'90e98385aa41634197e4c0fcd993e580', R:'b5cd2d6389f2fb07d44416c99b0a1f7d',
  S:'5324599e857c130633ec738115b3d386', T:'f318a8274c391c92fb2671249c98b92e',
  U:'4218b48977082c98b8701dda48a4940b', V:'fc3e4345eb67ad8e48cfa09fe900c6c6',
  W:'00b5741f3ec02704b3b7fd74bee62d5b', X:'a33e472eae8ea99c82e60c46a808d3f7',
  Y:'1a9d169389203b32a8c4538a477a7f86', Z:'375c1edac78c831ae9f100b6d7bd958b'
};

const items = data.terms.map(t => ({
  name: t.name,
  slug: t.slug,
  category: CATEGORY_IDS[t.category],
  'first-letter': FIRST_LETTER_IDS[t.firstLetter] || FIRST_LETTER_IDS.A,
  aliases: t.aliases || '',
  'short-definition': t.shortDefinition,
  'full-definition': mdToHtml(t.fullDefinition),
  'common-questions': faqHtml(t.commonQuestions),
  'key-symptoms': (t.keySymptoms || []).join(', '),
  'treated-at-mtc': t.treatedAtMTC,
  featured: t.featured,
  'seo-title': t.seoTitle,
  'seo-meta-description': t.seoDescription,
  'schema-json-ld': makeSchemaJsonLd(t),
  'publish-date': new Date().toISOString()
}));

// Batch into groups of 100
const batches = [];
for (let i = 0; i < items.length; i += 100) {
  batches.push({
    offset: i,
    items: items.slice(i, i + 100)
  });
}

// Manifest maps slug -> expected item-name -> will be mapped to real CMS id after upload
const manifest = data.terms.map(t => ({
  slug: t.slug,
  name: t.name,
  seedRelated: t.seedRelated || []
}));

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'import-payload.json'), JSON.stringify({ batches }, null, 2));
fs.writeFileSync(path.join(OUT_DIR, 'item-manifest.json'), JSON.stringify({ manifest }, null, 2));

console.log(`Built ${items.length} items across ${batches.length} batch(es).`);
console.log(`Wrote ${path.relative(root, path.join(OUT_DIR, 'import-payload.json'))}`);
console.log(`Wrote ${path.relative(root, path.join(OUT_DIR, 'item-manifest.json'))}`);
