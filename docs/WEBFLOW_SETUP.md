# Webflow Setup — As Built

This file documents how the live Directory section is wired together in Webflow. Everything described here is currently in production:

- ✅ **CMS collection** `Directory` (id `69ec1ea64d23f0cbe5590856`, slug `directory`, URL pattern `/directory/{slug}`) — 17 fields including `Schema Markup` (PlainText) and `Related Terms` (MultiReference)
- ✅ **All 208 CMS items** imported, related-term linked, and published
- ✅ **Detail template page** built with native bindable elements + JS-injection schema embed
- ✅ **Landing page** `/directory` built (hero, search, 7 category tiles, 46 featured chips, FAQ, CTA)
- ✅ **Navbar** updated with a Directory link in the navbar component
- ✅ **Site published** to `modernthyroidclinic.com`, `www.modernthyroidclinic.com`, and the Webflow subdomain

This file is the reference for: *(a)* how the detail template is bound, *(b)* the schema-injection embed pattern (the one tricky bit), and *(c)* how to recreate the work if anything is ever lost.

---

## Part 1 — Detail template structure (as built)

Open **Designer → Pages → Directory Term Template** to inspect.

The collection's detail template already exists at the URL pattern `/directory/{slug}`. Open **Designer → Pages → Directory Template → Directory Term Template**.

### Layout (top-to-bottom)

1. **Breadcrumb** (small grey bar): `Home › Directory › {Category} › {Name}`
2. **Category chip** (small pill, brand color, CMS-bound to Category field)
3. **H1 heading** bound to **Name** field
4. **Aliases row** — small muted text, bound to **Aliases** field, prefixed with "Also known as:"
5. **Short Definition** — lead paragraph, bound to **Short Definition**, larger font (~20 px)
6. **Full Definition** — standard RichText block bound to **Full Definition** (contains H2/H3, lists, bold, interlinks)
7. **Key Symptoms** section (only shows when field is non-empty):
   - H3 "Common symptoms"
   - Comma-split into a pill list (use a Collection List or manual split via custom code — see Appendix A)
8. **Common Questions** — RichText bound to **Common Questions** (renders as cascading `<h3>`/`<p>` pairs, easy to style as an accordion with Jetboost/Finsweet or vanilla `<details>`)
9. **Related Terms** — Collection List bound to the (soon-to-be-created) **Related Terms** multi-reference field. Show 4–6 cards with Name + Short Definition + link to `/directory/{slug}`.
10. **CTA block** — copy-paste from existing `Book a Discovery` CTA components on the site. Headline: *"Think you might be dealing with {{Name}}? Talk to a thyroid specialist."*
11. **Medical disclaimer** (small grey italic text block at bottom):
    > *This content is for educational purposes only and is not medical advice. Consult a licensed clinician for diagnosis and treatment. Content on this page does not create a doctor-patient relationship with Modern Thyroid Clinic.*
12. **Code Embed** at the bottom of the page that injects the schema.org JSON-LD via the JS-injection workaround (Webflow HTML-escapes CMS field tokens inside `<script>` tags, breaking JSON parsing — so we deliver the JSON via a hidden div + tiny JS that creates the real script tag). The embed contents are exactly:

    ```html
    <div id="mtc-schema-data" style="display:none">{{Schema Markup}}</div>
    <script>(function(){var el=document.getElementById('mtc-schema-data');if(!el)return;var s=document.createElement('script');s.type='application/ld+json';s.textContent=el.textContent;document.head.appendChild(s);el.remove();})();</script>
    ```

    This drops the pre-built DefinedTerm + MedicalEntity + FAQPage `@graph` JSON-LD into the page `<head>` at runtime. Validated via Google's Rich Results Test.

13. **Brand override `<style>` element** (first child of `.dir-detail`) loads Playfair Display + Source Sans Pro from Google Fonts and styles the Rich Text content (H2/H3 in brand ink, links in brand teal, Source Sans Pro body, Playfair Display headings). Inserted as a raw `<style>` DOM element via `element_builder` with `dom_tag: "style"` because `whtml_builder.css` strips compound selectors.

    **Critical CSS-in-Webflow gotcha:** inside that `<style>` element content, avoid `'`, `>`, and `&` — Webflow HTML-escapes them and browsers don't decode entities inside `<style>` tags. Use unquoted font names, descendant (space) selectors instead of `>`, and split `@import` into one statement per font family.

14. **Related Terms Collection List** in the right-side aside card. This is the only step that must be added through the Designer UI (the MCP can't create Collection List elements that bind to multi-reference fields):

    1. Click inside the empty "RELATED TERMS" aside card on the canvas
    2. Press `A` → drag in **Collection List** under Components
    3. In Settings → Source dropdown → pick **"Related Terms (Multi-ref…)"** under "Directory Fields"
    4. Click the first Collection Item box → press `A` → drag in a **Text Link** element
    5. Click the Text Link → Settings → check **"Get text from Directory"** → pick **Name**
    6. Click the link icons row → second icon (page) → pick **"Current item"** so URL auto-builds `/directory/{slug}`
    7. (Optional) Add a class for card-style padding/border/hover

### Page metadata (already set via API)

- **SEO Title**: bound to `SEO Title` CMS field
- **Meta Description**: bound to `SEO Meta Description` CMS field
- **Open Graph** copied from SEO.

### Styling guidance

Use existing MTC style variables (brand colors + typography from the Style Guide page). Keep the page feel consistent with `/blog/*` detail pages — those are your closest sibling templates.

---

## Part 3 — Build the `/directory` landing page

Create a new static page called **Directory** with slug `directory`.

### Sections

1. **Hero**
   - H1: "Modern Thyroid Clinic Health Directory"
   - Sub-headline: "Plain-language definitions of every thyroid, hormone, and metabolic term your care team uses — written by MTC clinicians."
   - Search input (see Part 4 for search integration)
2. **Category grid** — 7 tiles, one per category (Condition, Symptom, Medication, Supplement, Lab or Test, Procedure, Concept). Each tile links to a filtered view, e.g. `/directory?category=condition`. Use `categories.json` for copy and icons.
3. **Featured terms** — a Collection List of Directory items filtered to `Featured = true`, 6–12 cards.
4. **A–Z index** — a row of letter chips. Each chip is a link to `#letter-X`, which jumps to a section below. Each letter section is a Collection List filtered to `First Letter = X`, or (simpler) one big list with `display: grid` and 26 sub-lists.
5. **FAQ block** — cover: "What is this directory?", "Who writes these entries?", "Can I suggest a term?", "How is this different from WebMD?"
6. **CTA** — the standard Discovery Call CTA.

### Page SEO

- Title: **"Health Directory — Thyroid, Hormone & Metabolic Term Library | Modern Thyroid Clinic"**
- Meta description: **"Plain-language definitions of every thyroid, hormone, and weight-loss term MTC's clinicians use. Search 200+ conditions, labs, medications, and supplements."**

---

## Part 4 — Search integration

The existing `/search` page already searches Blogs, Podcasts, and Guides. To extend it to include the Directory, in Designer:

1. Open `/search` page.
2. Duplicate one of the existing result Collection Lists.
3. Retarget the new list to the **Directory** collection.
4. Filter by "Name contains {{search query}}" or "Aliases contains {{search query}}" (Webflow's built-in search syntax). The Aliases field is explicitly designed to catch alt-spellings and abbreviations.
5. Map card fields: Name → title, Short Definition → summary, Category → pill, link → `/directory/{slug}`.

---

## Part 5 — Add "Directory" to the primary nav

The main nav on Modern Thyroid Clinic is a **Symbol**. Open **Symbols → Main Nav** and add a new link:

- Text: **Directory**
- URL: `/directory`
- Insert it between "Resources" and "Blog" (or wherever fits visually).

Save the symbol — it propagates to every page automatically.

---

## Part 6 — Publish

1. Webflow → "Publish" → publish to `modernthyroidclinic.com` and `www.modernthyroidclinic.com`.
2. Run a crawl with [Screaming Frog](https://www.screamingfrog.co.uk/) or submit the updated sitemap to Google Search Console to accelerate indexing of the ~200 new URLs.
3. Verify structured data with [Google's Rich Results Test](https://search.google.com/test/rich-results) on 5–10 sample term pages — DefinedTerm and FAQPage should both appear.

---

## Appendix A — Key Symptoms pill list (custom code)

Drop this in an Embed inside the "Key Symptoms" section of the detail template. It reads the plain-text CMS value at `data-symptoms` and renders pills.

```html
<div class="mtc-symptom-list" data-symptoms="{{Key Symptoms}}"></div>
<style>
.mtc-symptom-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.mtc-symptom-list span { background: var(--brand--light, #F4F7F3); padding: 0.4rem 0.9rem; border-radius: 999px; font-size: 0.9rem; }
</style>
<script>
document.querySelectorAll('.mtc-symptom-list').forEach(el => {
  const raw = el.getAttribute('data-symptoms');
  if (!raw) { el.style.display = 'none'; return; }
  el.innerHTML = raw.split(',').map(s => `<span>${s.trim()}</span>`).join('');
});
</script>
```

## Appendix B — A–Z jump links (custom code)

In the Hero section, add an Embed with this horizontal A–Z bar. It hashes down to section anchors whose IDs are `letter-A` through `letter-Z`.

```html
<nav class="mtc-az" aria-label="Jump to letter">
  <!-- 26 <a> tags A–Z, each href="#letter-X" -->
</nav>
<style>
.mtc-az { display: flex; flex-wrap: wrap; gap: 0.25rem; padding: 1rem 0; }
.mtc-az a { display: inline-block; min-width: 2rem; text-align: center; padding: 0.35rem 0.5rem; border: 1px solid var(--brand--ink, #0f2a36); border-radius: 0.35rem; text-decoration: none; font-weight: 600; }
.mtc-az a:hover { background: var(--brand--ink, #0f2a36); color: #fff; }
</style>
<script>
const bar = document.querySelector('.mtc-az');
if (bar && !bar.children.length) {
  const letters = Array.from({length:26},(_,i)=>String.fromCharCode(65+i));
  bar.innerHTML = letters.map(l => `<a href="#letter-${l}">${l}</a>`).join('');
}
</script>
```
