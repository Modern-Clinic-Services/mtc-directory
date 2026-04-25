# MTC Directory — Automated Update & AEO/JSON-LD System Documentation

Complete reference for the Modern Thyroid Clinic AEO Directory pipeline:
how content edits in Webflow propagate to the live site automatically, and
how every piece is wired together.

**Last updated:** 2026-04-25
**Author:** Karl Krummenacher / Modern Clinic Services
**Repo:** <https://github.com/Modern-Clinic-Services/mtc-directory>
**Live URL:** <https://www.modernthyroidclinic.com/directory>

---

## 1. What this system does

The MTC Directory is a 208-entry public glossary of thyroid, hormone, and
metabolic terms hosted as a Webflow CMS collection at `/directory/{slug}`.

This documentation covers two intertwined subsystems:

1. **Content delivery** — how directory entries render with rich SEO
   (Schema.org JSON-LD for AEO/answer-engine optimization).
2. **Update automation** — how a content change in the Webflow CMS becomes a
   live site change in ~1 minute with zero manual steps.

The combined goal: editorial workflows where any clinical writer can publish a
new term in Webflow and have it automatically appear on the live site, with
correct schema markup, search behavior, and category filtering — without
anyone touching code, GitHub, Cloudflare, or a local machine.

---

## 2. End-to-end architecture

```
┌─────────────────────────┐
│ Webflow CMS (Directory) │ — 208 items, source of truth for content
└──────────┬──────────────┘
           │ Editor publishes a change
           │ (Site Publish)
           ↓
┌──────────────────────────────────────┐
│ Webflow Webhook (site_publish)       │ — POSTs signed JSON to the Worker
└──────────┬───────────────────────────┘
           │ HMAC-SHA256 signed
           ↓
┌──────────────────────────────────────────────────┐
│ Cloudflare Worker                                │
│ mtc-website-directory-update-hook                │ — validates signature,
│ Validates → fires repository_dispatch on GitHub  │   forwards as GH event
└──────────┬───────────────────────────────────────┘
           │ POST /repos/.../dispatches
           │ event_type: webflow_changed
           ↓
┌────────────────────────────────────────────────┐
│ GitHub Action: Refresh directory bundle        │
│ (.github/workflows/refresh-directory.yml)      │
│                                                │
│  1. Checkout repo                              │
│  2. Run scripts/build-directory-embed.mjs:     │
│     - Fetch all CMS items via Webflow API      │
│     - Build [name, slug, category, aliases]    │
│     - Rewrite var INDEX = ... in:              │
│       webflow/directory-page-embed.html        │
│       dist/mtc-directory.js                    │
│  3. Commit + push if anything changed          │
└──────────┬─────────────────────────────────────┘
           │ git push (commit on main)
           ↓
┌──────────────────────────────────────┐
│ GitHub repo                          │ — versioned source of truth
│ Modern-Clinic-Services/mtc-directory │   for the bundle
└──────────┬───────────────────────────┘
           │ jsDelivr pulls @main HEAD
           │ (edge cache TTL ~12h on
           │  branch refs, instant on
           │  pinned commits)
           ↓
┌────────────────────────────────────────────────────┐
│ jsDelivr CDN                                       │
│ cdn.jsdelivr.net/gh/Modern-Clinic-Services/        │
│   mtc-directory@main/dist/mtc-directory.js         │
└──────────┬─────────────────────────────────────────┘
           │ <script defer src="..."> in Webflow
           │ Site Settings → Custom Code → Footer
           ↓
┌──────────────────────────────────────┐
│ Live site: modernthyroidclinic.com   │ — directory + search behavior
│ /directory      /search              │   updates automatically
│ /directory/<slug>                    │
└──────────────────────────────────────┘
```

End-to-end latency from "Publish" click to live bundle: **~30 seconds to 1 minute**
(jsDelivr's edge cache may take a few additional minutes to fully refresh).

Self-healing fallback: if any webhook is dropped, a cron in the GitHub Action
runs every 6 hours and rebuilds anyway.

---

## 3. Components — what each one is and where its settings live

### 3.1 Webflow site

| Setting | Value |
|---|---|
| Site domain | `modernthyroidclinic.com` |
| Site ID | `65003933b9af86bc33bf4488` |
| CMS collection | `Directory` |
| Collection ID | `69ec1ea64d23f0cbe5590856` |
| URL pattern | `/directory/{slug}` |
| Detail template | Designer → Pages → Directory Term Template |
| Landing page | `/directory` |
| Search page | `/search` |

**Custom code installed (Site Settings → Custom Code → Footer Code):**

```html
<script defer src="https://cdn.jsdelivr.net/gh/Modern-Clinic-Services/mtc-directory@main/dist/mtc-directory.js"></script>
```

This single tag delivers the directory + search behavior described in §6.

**Webhook installed (Site Settings → Apps & Integrations → Webhooks):**

| Field | Value |
|---|---|
| Trigger type | `Site Publish` |
| API version | V2 |
| Webhook URL | `https://mtc-website-directory-update-hook.domains-c9d.workers.dev` |
| Secret key | (auto-generated by Webflow on creation; mirrored into Cloudflare Worker secret `WEBFLOW_WEBHOOK_SECRET`) |

Only one webhook is needed. "Site Publish" fires on every publish, which is
the only moment when a CMS edit becomes externally visible — perfectly
aligned with when a rebuild should happen.

**API tokens (Workspace Settings → Integrations → API Access, site-scoped):**

| Token name | Scope | Where used |
|---|---|---|
| `WEBFLOW_API_TOKEN` | CMS → Read | Stored in GitHub repo secrets; consumed by the Action's build script |

---

### 3.2 GitHub repository

**Repo:** [Modern-Clinic-Services/mtc-directory](https://github.com/Modern-Clinic-Services/mtc-directory) (public)

Public visibility is required for jsDelivr to serve files; no secrets are
committed to the repo (see `.gitignore`).

**Layout:**

```
mtc-directory/
├── .github/workflows/
│   └── refresh-directory.yml          # The auto-rebuild Action
├── content/                           # Authored term content (JSON per entry)
│   ├── _reference-entry.json
│   ├── entries/                       # 208 individual term files
│   └── writers/                       # Writer attribution metadata
├── data/                              # Master indexes (authored)
│   ├── categories.json                # 7 category definitions
│   ├── terms-index.json               # Full term metadata (208)
│   └── terms.json                     # Long-form content
├── dist/                              # Build output → jsDelivr serves this
│   └── mtc-directory.js               # Pure-JS bundle (CSS+logic+index)
├── docs/
│   ├── PROJECT_PLAN.md
│   └── WEBFLOW_SETUP.md               # Original CMS schema build doc
├── scripts/
│   ├── build-directory-embed.mjs      # Action runs this; rebuilds bundle
│   ├── build-payload.mjs              # (legacy) initial CMS import
│   ├── build-related-refs.mjs         # (legacy) related-terms backfill
│   ├── cleanup-partial-items.mjs      # (legacy) cleanup tool
│   ├── import-to-webflow.mjs          # (legacy) initial import
│   └── merge-entries.mjs              # (legacy) source-data merger
├── webflow/
│   ├── collection-schema.json         # CMS field reference
│   ├── directory-page-embed.html      # Page-Embed source (also a build artifact)
│   ├── live-items*.json               # API-returned IDs from initial import
│   ├── batch-*.json                   # (legacy) import batches
│   └── chunk-*.json                   # (legacy) import chunks
├── worker/                            # Cloudflare Worker source
│   ├── package.json
│   ├── README.md                      # Deploy guide
│   ├── src/index.js                   # The Worker code
│   └── wrangler.toml                  # Worker config
├── .gitignore
├── FINAL-STEPS.md                     # Original launch checklist
├── README.md
└── MTC-Directory-Update-AEO-JSON-Documentation.MD  # This file
```

**Repository secret (Settings → Secrets and variables → Actions):**

| Name | Value | Used by |
|---|---|---|
| `WEBFLOW_API_TOKEN` | Webflow CMS-read token | Action's build step |

**Action workflow (`.github/workflows/refresh-directory.yml`):**

Triggers:
- `repository_dispatch` (event type `webflow_changed`) — fired by the Worker
- `schedule` (cron `0 */6 * * *`) — safety-net rebuild every 6 hours
- `workflow_dispatch` — manual "Run workflow" button in the Actions tab

Runs on `ubuntu-latest` with Node 24. Uses `actions/checkout@v4` and
`actions/setup-node@v4` with `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` set
(silences a deprecation notice; remove when those actions ship v5).

Steps:
1. `actions/checkout@v4`
2. `actions/setup-node@v4` with `node-version: '24'`
3. `node scripts/build-directory-embed.mjs` — see §4 for details
4. `git diff --quiet -- dist webflow/directory-page-embed.html`; if changed:
   `git commit -m "chore: refresh directory bundle (...)"` and `git push`

Concurrency group: `refresh-directory`, cancel-in-progress: false (a queued
run finishes even if another is requested).

Permissions: `contents: write` (so the workflow can push).

---

### 3.3 Cloudflare Worker

**Account:** Domains@ModernThyroidClinic.com (account ID `c9d82605d89af439f03fdbedc979a6ac`)
**Worker name:** `mtc-website-directory-update-hook`
**Public URL:** <https://mtc-website-directory-update-hook.domains-c9d.workers.dev>
**Source:** `worker/src/index.js`
**Config:** `worker/wrangler.toml`
**Compatibility date:** `2025-01-01`

**Worker secrets (`wrangler secret put`):**

| Name | Source | Purpose |
|---|---|---|
| `WEBFLOW_WEBHOOK_SECRET` | Webflow webhook auto-generated key (copied at creation time) | HMAC-validates incoming webhooks |
| `GITHUB_PAT` | Fine-grained PAT on `Modern-Clinic-Services/mtc-directory` with Contents: read+write | Authorizes `repository_dispatch` POST |

**What the Worker does on each request:**

1. **GET** → returns `mtc-website-directory-update-hook is alive` (used as a health check)
2. **POST** → validates as a Webflow webhook:
   - Reads `x-webflow-signature` and `x-webflow-timestamp` headers; rejects 401 if missing
   - Rejects 401 if timestamp is more than ±5 min from now (replay protection)
   - Computes `HMAC-SHA256(WEBFLOW_WEBHOOK_SECRET, "${timestamp}:${rawBody}")`; rejects 401 on mismatch
   - Parses body as JSON; reads `triggerType` and `payload.collectionId`
   - Filters to relevant events:
     - `site_publish` / `site_publishing` (always relevant)
     - `collection_item_created/changed/updated/deleted/unpublished` for the Directory collection (or with no `collectionId`)
   - Anything else returns 200 with `Ignored: <trigger>` (so Webflow doesn't retry)
   - Otherwise: POSTs to `https://api.github.com/repos/Modern-Clinic-Services/mtc-directory/dispatches` with:

     ```json
     {
       "event_type": "webflow_changed",
       "client_payload": {
         "trigger": "...",
         "itemId": "...",
         "collectionId": "...",
         "dispatchedAt": "2026-04-25T..."
       }
     }
     ```

   - Returns 200 `Dispatched (<trigger>)` on success, or 502 with the GitHub error body on failure

**Observability:**

- Live tail: `wrangler tail --format pretty` from the `worker/` directory
- Dashboard: Cloudflare → Workers & Pages → `mtc-website-directory-update-hook` → Logs (recommended; survives terminal disconnects)

---

### 3.4 jsDelivr CDN

The directory bundle is served by jsDelivr — a free public CDN that
edge-caches GitHub-hosted files globally.

**URL:**
```
https://cdn.jsdelivr.net/gh/Modern-Clinic-Services/mtc-directory@main/dist/mtc-directory.js
```

**Caching behavior:**
- `@main` ref → cached at the edge for ~12 hours, refreshed on the next request after that
- `@<commit-sha>` ref → cached forever (immutable URL)
- `@<tag>` ref → cached forever once the tag exists

**Performance:**
- HTTP/2, served from the nearest of ~200 PoPs globally
- `content-type: application/javascript; charset=utf-8` (correct, so browsers execute it)
- Brotli + gzip negotiated via `accept-encoding`
- CORS open: `access-control-allow-origin: *`
- Strict-Transport-Security enabled

**To force-bust the cache after a critical update**, change the URL in
Webflow's Footer Code from `@main` to `@<commit-sha>` (e.g. `@a1b2c3d`) and
republish the site. Pinning to commits is also higher performance long-term —
worth doing for major releases.

---

## 4. The build script (`scripts/build-directory-embed.mjs`)

This is the single function that turns Webflow CMS state into the JS bundle.

**Inputs:**
- Environment variable `WEBFLOW_API_TOKEN` (CMS-read scope)
- File: `webflow/directory-page-embed.html` — the source-of-truth template
  containing CSS, JS logic, and a placeholder `var INDEX = [...];` literal

**Process:**

1. Page through Webflow CMS API:
   - `GET /v2/collections/69ec1ea64d23f0cbe5590856/items?limit=100&offset=N`
   - Continues until a page returns < 100 items
2. Filter out archived and draft items
3. For each remaining item, extract:
   - `name` (PlainText, required)
   - `slug` (PlainText, required)
   - `category` (Option — resolved from either label "Condition" or option ID `f1c02f1d…` to lowercase slug `condition`)
   - `aliases` (PlainText; commas in source are normalized to `|` separators)
4. Sort alphabetically by name
5. Emit a tight tuple array: `[[name, slug, categorySlug, aliases], ...]`
6. Replace the `var INDEX = [...];` literal in `webflow/directory-page-embed.html`
7. Re-emit `dist/mtc-directory.js` (the embed's `<style>` block is JSON-encoded
   into a `style.textContent` assignment; the embed's `<script>` body is
   appended verbatim)
8. Print a summary including category counts (for sanity)

**Outputs:**
- `webflow/directory-page-embed.html` (rewritten in place)
- `dist/mtc-directory.js` (rewritten in place)

The build is idempotent: running it on already-current state produces no diff
and the Action skips the commit step.

---

## 5. The Webflow Page Embed (page-level, optional alternative)

If for some reason the Site-wide Footer Code approach can't be used (e.g.
Webflow plan limits, conflict with other footer code), the same code can be
pasted as a per-page Embed.

**File:** `webflow/directory-page-embed.html` — full source (CSS + JS, ~30KB)

**Where to paste:** Webflow Designer → open the `/directory` page → drop an
Embed element at the bottom → paste contents → save → publish. Then repeat
for `/search`.

The script self-dispatches by `location.pathname`, so the same code works on
both pages without changes.

For the recommended Footer Code approach (one paste, both pages), use the
jsDelivr URL — see §3.1.

---

## 6. Front-end behavior (what the embed does on the live site)

### On `/directory`:

1. **Layout fix (CSS):** The default Webflow form (185px input + bright blue
   `Submit` button, no border-radius) is replaced with a flex layout, full-width
   rounded input, dark branded button labeled "Search".
2. **Category tile rewrite:** All `<a>` tags pointing at
   `/search?query=<category>` are rewritten to `/directory?category=<category>`
   so they filter the directory itself instead of fuzzy-matching the literal
   word in global site search.
3. **Search submit:** The form submit handler is intercepted; submission
   redirects to `/directory?query=<term>` (same page, with a query parameter).
4. **URL-driven results renderer:** On page load, if `?query=` or `?category=`
   is present, the embed:
   - Searches the baked 208-entry index by name and aliases
   - Ranks: name-starts-with > name-contains > alias-match
   - Hides the marketing sections (categories grid, featured chips, FAQ)
   - Renders a card grid into a new `.mtc-results` container injected after the hero
   - Cards show: name, category pill, "match: <alias>" hint when relevant
   - Links to `/directory/<slug>`

### On `/search`:

1. **Layout fix (CSS):** Same form treatment as `/directory`. Native
   `.search-result-items` divs are styled into clean cards (title link, muted
   URL, snippet).
2. **Native results de-dup:** Any native search result whose URL starts with
   `/directory/` is removed from the list (the embed surfaces those itself
   with richer formatting).
3. **Directory matches injection:** The embed waits for the native results to
   render (poll up to 30 ticks at 200ms), then injects a "Directory entries
   for <query>" section above them. Up to 12 cards are shown; if more match,
   a "View all N in the directory →" link points to `/directory?query=<term>`.
4. **Section header:** "Other pages on the site" header separates the directory
   matches from the rest of the native search results.

### Everywhere else:

The embed is a no-op. The pathname dispatcher only activates on
`/directory` and `/search`.

---

## 7. AEO / SEO / JSON-LD Schema markup

This is the *content* layer that makes directory entries stand out in
generative answer engines (Google AI Overviews, Bing Copilot, ChatGPT
browse, etc.) and traditional search.

### 7.1 Per-entry rich data

Each Directory CMS entry has a `Schema Markup` PlainText field containing a
pre-built `@graph` of three Schema.org types:

- `DefinedTerm` — the canonical entity, with name, definition, alternate names (aliases), and category mapped to a `DefinedTermSet`
- `MedicalEntity` (when applicable) — clinical metadata
- `FAQPage` — common-questions block, where each question/answer pair becomes a `Question` + `Answer` node

### 7.2 Injection mechanism

Webflow HTML-escapes CMS field tokens inside `<script>` tags, which breaks
JSON-LD parsing. The detail template uses a workaround:

```html
<div id="mtc-schema-data" style="display:none">{{Schema Markup}}</div>
<script>
(function () {
  var el = document.getElementById('mtc-schema-data');
  if (!el) return;
  var s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = el.textContent;
  document.head.appendChild(s);
  el.remove();
})();
</script>
```

The CMS field's contents are deposited into a hidden `<div>`, then a tiny
inline script promotes them to a real `<script type="application/ld+json">`
in `<head>` at runtime — bypassing Webflow's HTML-escape behavior.

Validated with Google's Rich Results Test on multiple sample slugs.

### 7.3 Page-level SEO

Detail template metadata bound from CMS fields:
- Title → `SEO Title`
- Meta description → `SEO Meta Description`
- Open Graph (title/description) — bound to the same fields
- Canonical URL — Webflow's default (the page URL)

Sitemap: Webflow auto-generates `/sitemap.xml` covering all 208 directory
URLs. Crawl with Screaming Frog or submit the sitemap to Google Search
Console to accelerate indexing.

---

## 8. Operating procedures

### 8.1 Adding / editing a directory term

The intended workflow — no engineer involvement:

1. Log into Webflow → CMS → Directory collection
2. Add or edit an item
3. Click **Publish**
4. Within ~1 minute, the change is live on the site, including the search
   index, category filters, and JSON-LD schema

That's it. The Worker → Action → jsDelivr chain handles everything else.

### 8.2 Forcing a manual rebuild

If you need an immediate refresh (e.g. you just bulk-edited 30 entries and
don't want to wait for any caches):

- **Option A — manual Action run:** <https://github.com/Modern-Clinic-Services/mtc-directory/actions/workflows/refresh-directory.yml> → **Run workflow** → main → Run.
- **Option B — pin a commit SHA:** Replace `@main` with `@<sha>` in Webflow's
  Footer Code and republish. Forces every visitor's next page load to hit
  the new bundle immediately.

### 8.3 Rotating tokens / secrets

| Secret | When to rotate | How |
|---|---|---|
| `WEBFLOW_API_TOKEN` (GitHub) | If exposed; or on a 6-month schedule | Generate new token in Webflow Site Settings → Apps & Integrations → API access (CMS: Read scope) → revoke old token → update GitHub repo secret |
| `WEBFLOW_WEBHOOK_SECRET` (Cloudflare) | If exposed; or yearly | Delete the Webflow webhook → recreate (Webflow generates new secret) → copy it → `wrangler secret put WEBFLOW_WEBHOOK_SECRET` |
| `GITHUB_PAT` (Cloudflare) | On its expiration; or yearly; or if the previous owner leaves | Create new fine-grained PAT scoped to mtc-directory repo, Contents: r/w → `wrangler secret put GITHUB_PAT` → revoke old PAT |

### 8.4 Troubleshooting

| Symptom | Likely cause | Diagnostic |
|---|---|---|
| Webflow publish fires no Action run | Webhook signature mismatch (secret out of sync) | Cloudflare Logs → look for 401 response. Re-do §8.3 row 2. |
| Action runs but commits nothing | CMS API returned no diff vs current bundle | Check Action log; this is a no-op, not a bug |
| Action fails with 403 OAuthForbidden | Token missing `cms:read` scope | Regenerate token with CMS Read enabled, update GitHub secret |
| Bundle on jsDelivr is stale despite Action commits | jsDelivr edge cache lag | Wait up to 12h, or pin `@<sha>` in Footer Code |
| `/directory` shows raw Webflow form | Footer Code missing or jsDelivr URL wrong | Verify Site Settings → Custom Code → Footer Code contains the script tag |
| Worker returns 502 to Webflow | GitHub PAT invalid/expired | Cloudflare Logs → look for `GitHub dispatch failed: 401`. Rotate per §8.3 row 3. |

### 8.5 Dev-loop changes (modifying the embed itself)

If a change to *how* the directory or search pages behave is needed (not the
content, but the code itself):

1. Clone the repo locally (any machine):
   ```
   git clone https://github.com/Modern-Clinic-Services/mtc-directory.git
   ```
2. Edit `webflow/directory-page-embed.html`
3. Test locally: open the site, paste the script into the browser console
   to test, OR deploy a feature branch to a staging Worker URL
4. Push to `main` (manually, via PR, or directly)
5. The next `repository_dispatch` (or scheduled cron, or `workflow_dispatch`)
   rebuilds and publishes — but for embed-code changes specifically, you
   can trigger immediately via "Run workflow" in the Actions tab. The build
   script regenerates `dist/mtc-directory.js` from `webflow/directory-page-embed.html`,
   and jsDelivr edge-refreshes within ~12h on `@main` (or instantly on a
   pinned SHA).

---

## 9. Security model

### 9.1 What is public

- The GitHub repo is public — required for jsDelivr to serve files
- The Worker URL is public (cannot be otherwise) — but only signed Webflow
  requests get past the 401 wall
- The published bundle on jsDelivr is public — it's running on every
  visitor's browser anyway

### 9.2 What is secret

| Secret | Lives in | Never written to disk anywhere else |
|---|---|---|
| Webflow CMS API token | GitHub Actions Secrets (encrypted at rest) | ✓ |
| Webflow webhook signing key | Cloudflare Worker Secrets (encrypted at rest) | ✓ |
| GitHub PAT for the Worker | Cloudflare Worker Secrets (encrypted at rest) | ✓ |

`.gitignore` excludes `.claude/` (where local agent settings can capture
tokens), `.env*`, and other typical secret-bearing files.

### 9.3 Threat model

- **Replay attacks on the Worker:** Mitigated by `±5 min` timestamp window.
- **Forged webhooks:** Mitigated by HMAC-SHA256 signature with constant-time
  comparison.
- **Compromised jsDelivr file:** jsDelivr serves files exactly as committed
  to GitHub; integrity equals git integrity. To mitigate against jsDelivr
  itself being compromised, you can pin Subresource Integrity (SRI) hashes
  in the Footer Code (not currently enabled — adding this would slow the
  update loop since SRI changes per build).
- **Compromised GitHub PAT:** Worker can dispatch arbitrary `event_type`
  values, but the only handler in the repo is `webflow_changed`, which only
  runs the build script with read-only Webflow API access and a `git push`
  scoped to `dist/` and `webflow/directory-page-embed.html` (path-restricted
  by the workflow's `git diff --quiet -- ...` guard).
- **Compromised Webflow CMS API token:** Read-only scope; cannot modify CMS
  content, only enumerate it.

---

## 10. Cost model

All components are on free tiers and stay there at this volume:

| Component | Free tier limit | Current usage |
|---|---|---|
| GitHub Actions | Unlimited for public repos | ~30 sec/run × ~10 runs/day = trivial |
| Cloudflare Workers | 100k requests/day | < 50/day |
| jsDelivr | Unlimited, free CDN forever | ~ free |
| Webflow webhooks | Unlimited | 1 webhook |
| Webflow CMS | Existing site plan | unchanged |

No new recurring costs were introduced by this system.

---

## 11. Recovery procedures (if something major breaks)

### 11.1 jsDelivr is down or returning 404 for the bundle

Worst-case: the directory and search pages still render their static
Webflow content (the embed just doesn't enhance them). Search box reverts to
the unbranded Webflow default and category tiles point to `/search?query=...`
again — degraded but not broken.

If you need a quick alternative:
1. Upload `dist/mtc-directory.js` to a different CDN (Cloudflare R2 with a
   public URL, Vercel static deploy, Netlify Drop)
2. Update the Footer Code to point to the new URL
3. Republish

### 11.2 The repo is deleted or compromised

The Webflow CMS is the source of truth for content. The repo is rebuildable:

1. Clone fresh from any backup, or fork from a member's local copy
2. Reset the GitHub remote: `gh repo create Modern-Clinic-Services/mtc-directory --public --source=. --push`
3. Re-add `WEBFLOW_API_TOKEN` to repo secrets
4. Re-issue the Cloudflare Worker `GITHUB_PAT` for the new repo (if scoped to a deleted-repo, it's no longer valid)
5. Run the Action manually once to regenerate `dist/mtc-directory.js`
6. jsDelivr resumes serving as soon as the file is there

### 11.3 The Cloudflare Worker is deleted or the account is lost

Webhook delivery stops; cron-based rebuilds continue every 6 hours. To restore:

1. Re-clone repo, `cd worker && wrangler login && wrangler deploy`
2. `wrangler secret put WEBFLOW_WEBHOOK_SECRET` and `wrangler secret put GITHUB_PAT`
3. Update the Webflow webhook URL if the workers.dev subdomain changed

### 11.4 Webflow site is wiped

The CMS data is the irreplaceable layer. Backups:
- `data/terms-index.json` and `data/terms.json` in the repo contain the
  authored content as JSON
- `webflow/import-payload.json` contains the original import payload
- `scripts/import-to-webflow.mjs` will re-import everything to a fresh CMS collection

---

## 12. Future improvements (not yet implemented)

- **Subresource Integrity (SRI):** Pin a hash to the `<script>` tag for
  defense-in-depth against jsDelivr compromise. Trade-off: requires updating
  the SRI hash on every build, breaking the "edit-and-publish" simplicity.
- **Per-event webhooks:** Currently only Site Publish triggers the Worker.
  Adding per-collection-item-change webhooks would mean rebuilds fire even
  for unpublished drafts (currently filtered out). Not generally desirable
  but doable if desired.
- **Pinned-commit Footer Code:** Switch the Footer Code URL from `@main` to
  a specific commit SHA on each release for instantly-applied updates and
  forever-cached browser bundles. Trade-off: requires updating the Footer
  Code on every meaningful change (could automate via a follow-on Action).
- **Native Webflow site search inclusion:** Webflow's built-in search
  doesn't index `/directory/{slug}` pages well yet; this should improve as
  Webflow re-crawls. Currently mitigated by the embed surfacing directory
  matches above native results on `/search`.

---

## 13. Quick reference

**URLs:**
- Live site: <https://www.modernthyroidclinic.com/directory>
- Repo: <https://github.com/Modern-Clinic-Services/mtc-directory>
- Worker: <https://mtc-website-directory-update-hook.domains-c9d.workers.dev>
- Bundle: <https://cdn.jsdelivr.net/gh/Modern-Clinic-Services/mtc-directory@main/dist/mtc-directory.js>
- Action runs: <https://github.com/Modern-Clinic-Services/mtc-directory/actions>
- Worker logs: Cloudflare Dashboard → Workers & Pages → mtc-website-directory-update-hook → Logs

**IDs:**
- Webflow site ID: `65003933b9af86bc33bf4488`
- Webflow Directory collection ID: `69ec1ea64d23f0cbe5590856`
- Cloudflare account ID: `c9d82605d89af439f03fdbedc979a6ac`
- GitHub repo: `Modern-Clinic-Services/mtc-directory`

**Most-common command:**
```bash
# Force-rebuild from current Webflow state (run from anywhere with the repo cloned)
gh workflow run refresh-directory.yml --repo Modern-Clinic-Services/mtc-directory
```
