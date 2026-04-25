# Modern Thyroid Clinic — AEO Directory Project

A searchable, SEO + AEO-optimized directory of 208 thyroid, hormone, endocrinology, and metabolic health terms, integrated as a CMS-backed section of [modernthyroidclinic.com](https://www.modernthyroidclinic.com/directory).

**Live URL:** https://www.modernthyroidclinic.com/directory
**Site ID:** `65003933b9af86bc33bf4488`
**Collection ID:** `69ec1ea64d23f0cbe5590856`
**Detail template page ID:** `69ec1ea64d23f0cbe559085c` (URL pattern `/directory/{slug}`)
**Landing page ID:** `69ec9ecd2c57b5382a624cf4` (URL `/directory`)

---

## Status: ✅ Fully launched

- 208 entries authored, imported, interlinked, and published
- Detail template page built in Webflow Designer with native bindable elements (CMS-bound title, category, aliases, lead, full-definition Rich Text, key-symptom pills, common-questions Rich Text, CTA, disclaimer)
- Brand-aligned typography (Playfair Display headings + Source Sans Pro body, loaded via Google Fonts `@import`) and brand-teal interlinks (`#376c74`) inside Rich Text content
- **Related Terms Collection List** in the right-side aside, bound to the multi-reference field — every detail page shows 3–8 hand-curated related terms with clickable links
- Landing page built (hero, search, 7 categories, 46 featured chips, FAQ, CTA)
- "Directory" link added to navbar (propagates site-wide)
- Schema.org JSON-LD live on every detail page (DefinedTerm + category-specific MedicalEntity + FAQPage in a single `@graph`)
- Site published

### Known minor issue

The "Puffy Face" entry currently lives at `/directory/facial-edema` because Webflow's slug-uniqueness cache held `puffy-face` after a duplicate cleanup. Rename it to `puffy-face` from the CMS UI when convenient (cache should clear within 24 hours of original cleanup).

---

## What's in this repo

```
.
├── README.md                              ← you are here
├── FINAL-STEPS.md                         ← post-launch reference
├── docs/
│   ├── PROJECT_PLAN.md                    ← scope, content model, SEO/AEO strategy
│   └── WEBFLOW_SETUP.md                   ← Designer build guide (page templates, embeds, nav)
├── data/
│   ├── categories.json                    ← 7 category definitions + SEO defaults
│   ├── terms-index.json                   ← master index of 208 terms (name, slug, category, aliases, related-term seeds)
│   └── terms.json                         ← (generated) full dataset with all authored content
├── content/
│   ├── _reference-entry.json              ← gold-standard entry (Hashimoto's), used as the writing template
│   └── entries/                           ← one JSON file per term
├── scripts/
│   ├── merge-entries.mjs                  ← merges content/entries/ + index → data/terms.json
│   ├── build-payload.mjs                  ← converts terms.json → Webflow API import batches (with Markdown→HTML, JSON-LD generation, FAQ HTML)
│   ├── build-related-refs.mjs             ← second-pass: links Related Terms after items exist in Webflow
│   ├── import-to-webflow.mjs              ← direct REST upload of all items via Webflow v2 API
│   └── cleanup-partial-items.mjs          ← deletes orphaned/partial items from earlier MCP attempts
└── webflow/
    ├── collection-schema.json             ← canonical CMS schema with all field IDs
    ├── import-payload.json                ← (generated) bulk-import payload
    ├── item-manifest.json                 ← (generated) slug → name mapping for related-term linking
    ├── live-items.json                    ← (generated) item ID map captured from Webflow after import
    ├── related-updates.json               ← (generated) second-pass payload with related-terms references
    └── chunk-XX.json                      ← (legacy) per-chunk payloads from the early MCP-upload approach
```

---

## CMS schema (final, as live in Webflow)

| Field slug | Display name | Type | Notes |
|---|---|---|---|
| `name` | Name | PlainText (auto) | Term display name |
| `slug` | Slug | PlainText (auto) | URL path |
| `category` | Category | Option | 7 options: Condition, Symptom, Medication, Supplement, Lab or Test, Procedure, Concept |
| `first-letter` | First Letter | Option | A–Z (for alphabetical filter) |
| `aliases` | Aliases | PlainText | Alt names / abbreviations (comma-separated) |
| `short-definition` | Short Definition | PlainText | 140–160 char snippet |
| `full-definition` | Full Definition | RichText | Primary body content (H2/H3 structure) |
| `common-questions` | Common Questions | RichText | FAQ HTML block |
| `key-symptoms` | Key Symptoms | PlainText | Comma-separated (rendered as pill chips by JS) |
| `treated-at-mtc` | Treated At MTC | Switch | True if MTC actively manages this condition |
| `featured` | Featured | Switch | Surfaced on /directory landing page |
| `seo-title` | SEO Title | PlainText | 50–70 chars |
| `seo-meta-description` | SEO Meta Description | PlainText | 150–160 chars |
| `schema-markup` | **Schema Markup** | **PlainText** | **Pure JSON `@graph` (no `<script>` wrapper). Used by HTML Embed via JS-injection trick — see "Schema injection" below.** |
| `schema-json-ld` | Schema JSON-LD (legacy) | RichText | Original RichText version — superseded by `schema-markup` and not referenced by the live template. Safe to delete in CMS Settings. |
| `publish-date` | Publish Date | DateTime | Freshness signal |
| `related-terms` | Related Terms | MultiReference → Directory | 3–8 related terms per entry |

---

## Two Webflow gotchas worth knowing

### 1. Brand CSS injection (don't use whtml_builder's `css` parameter for compound selectors)

Webflow's `whtml_builder` strips compound CSS selectors (`.dir-detail .w-richtext h2 { … }`) and only preserves single-class rules from the `css` parameter — meaning Rich Text and other deep-bindings can't be styled that way.

The working pattern: use `element_builder` to insert a raw `<style>` DOM element into the page and put the CSS in its `set_text` content. Webflow doesn't process the contents of a `<style>` DOM element the way it processes `whtml_builder`'s css — but it DOES HTML-escape any of the following characters:

- `'` (single quote)  → `&#x27;`
- `>` (greater-than) → `&gt;`
- `&` (ampersand)    → `&amp;`

Browsers don't decode entities inside `<style>` tags, so any of those will silently break the CSS rule. Workarounds:

- **Font names without quotes**: `font-family: Playfair Display, Georgia, serif` (CSS allows unquoted multi-word identifiers)
- **No `>` combinators**: use descendant selectors (space) instead, or rewrite the rule
- **No `&` in `@import` URLs**: split into multiple `@import` statements, one per font family

The detail template's brand CSS (live in the page right now) is wrapped exactly this way and passes through Webflow's serializer cleanly. See `<style>` element id `d6ac6fa4-f3b0-b836-d4cb-f6fa175fb8f9` inside the dir-detail wrapper.

### 2. Schema injection

Webflow's HTML Embed **HTML-escapes any CMS field token** inserted via "Add field". So the obvious pattern doesn't work:

```html
<!-- ❌ BROKEN — Webflow escapes " to &quot; inside the script tag, breaking JSON parsing -->
<script type="application/ld+json">{{Schema Markup}}</script>
```

The working pattern (live in the detail template right now) puts the escaped content into a hidden `<div>` and uses inline JS to copy it into a real `<script>` tag (browsers DO decode entities inside divs):

```html
<div id="mtc-schema-data" style="display:none">{{Schema Markup}}</div>
<script>(function(){var el=document.getElementById('mtc-schema-data');if(!el)return;var s=document.createElement('script');s.type='application/ld+json';s.textContent=el.textContent;document.head.appendChild(s);el.remove();})();</script>
```

How it works:
- Webflow renders the field content with HTML entities (`&quot;` instead of `"`) inside the div's text content
- Browsers automatically decode HTML entities for text content inside non-script elements
- The JS reads the decoded text via `.textContent`, creates a proper `<script type="application/ld+json">` tag, and appends it to `<head>`
- Google, Perplexity, ChatGPT etc. — all of which execute JS during indexing — see the valid JSON-LD

**The Schema Markup field stores a single `@graph` JSON object** (no script wrappers) combining DefinedTerm + category-specific MedicalEntity (MedicalCondition / MedicalSignOrSymptom / Drug / MedicalTest / MedicalProcedure) + FAQPage. Verified with Google's Rich Results Test.

---

## Build & re-import pipeline

If you ever need to regenerate content + re-import everything:

```bash
cd "/Users/karlkrummenacher/Documents/MTC | AEO Directory/MTC | AEO Directory Project"

# 1. Merge per-entry JSON files into the master dataset
node scripts/merge-entries.mjs

# 2. Build the Webflow import payload (generates HTML, JSON-LD, etc.)
node scripts/build-payload.mjs

# 3. Bulk-create items in Webflow
export WEBFLOW_API_TOKEN="..."
node scripts/import-to-webflow.mjs

# 4. After items exist, build the related-terms link payload
node scripts/build-related-refs.mjs

# 5. PATCH related-terms references — see inline node snippet below

# 6. Publish all items — see snippet below
```

### Re-PATCH Schema Markup field

If the schema generation logic changes, regenerate and re-patch with this inline script:

```bash
export WEBFLOW_API_TOKEN="..."
# regenerates @graph JSON, patches all 208 items, and publishes them
node -e "
const fs = require('fs');
const SITE='https://www.modernthyroidclinic.com', DIR='/directory';
const data=JSON.parse(fs.readFileSync('data/terms.json'));
function makeGraph(t){
  const url=SITE+DIR+'/'+t.slug; const blocks=[];
  blocks.push({'@type':'DefinedTerm',name:t.name,alternateName:t.aliases?t.aliases.split(',').map(a=>a.trim()).filter(Boolean):undefined,description:t.shortDefinition,inDefinedTermSet:SITE+DIR,url});
  if(['Condition','Symptom','Medication','Lab or Test','Procedure'].includes(t.category)){
    const m={Condition:'MedicalCondition',Symptom:'MedicalSignOrSymptom',Medication:'Drug','Lab or Test':'MedicalTest',Procedure:'MedicalProcedure'}[t.category];
    const b={'@type':m,name:t.name,description:t.shortDefinition,url};
    if(t.keySymptoms?.length) b.signOrSymptom=t.keySymptoms.map(s=>({'@type':'MedicalSignOrSymptom',name:s}));
    blocks.push(b);
  }
  if(t.commonQuestions?.length) blocks.push({'@type':'FAQPage',mainEntity:t.commonQuestions.map(q=>({'@type':'Question',name:q.q,acceptedAnswer:{'@type':'Answer',text:q.a}}))});
  return JSON.stringify({'@context':'https://schema.org','@graph':blocks});
}
// ... PATCH loop, see scripts/import-to-webflow.mjs for full Webflow API helper
"
```

The above command is preserved in the project's bash history (and used in the original launch).

---

## SEO / AEO design notes

- **Single `@graph` JSON-LD** per page combines DefinedTerm + MedicalEntity + FAQPage so all show up in one parser pass
- **Question-style H2s** in every full definition match how patients phrase queries
- **Self-contained first sentences** — every entry leads with `<Term> is <plain-language definition>` for AI single-sentence quoting
- **Aliases CMS field** powers cross-search ("Hashi", "low T", brand names)
- **Related Terms multi-reference** for interlinking
- **E-E-A-T** — branded clinic disclaimer block on every entry, professional tone, no medical advice claims

---

## Quick links

- Directory landing: https://www.modernthyroidclinic.com/directory
- Sample term page: https://www.modernthyroidclinic.com/directory/hashimotos-thyroiditis
- Webflow Designer: https://modern-thyroid-clinic.design.webflow.com
- Validate schema on a page: https://search.google.com/test/rich-results
