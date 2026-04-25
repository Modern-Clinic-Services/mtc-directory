# MTC Website Directory Update Hook (Cloudflare Worker)

Receives Webflow CMS webhooks → validates the HMAC signature → fires a
`repository_dispatch` on this repo so the **Refresh directory bundle** GitHub
Action rebuilds and pushes a fresh `dist/mtc-directory.js`.

End-to-end latency: ~10 seconds from "Publish" in Webflow to the new bundle on jsDelivr.

```
Webflow publish → CF Worker → GitHub Action → repo push → jsDelivr edge
```

## One-time setup

Run these from anywhere with `npm` and a browser. After this is set up you never
have to touch your local machine again — the system runs itself.

### 1. Generate a GitHub fine-grained PAT

1. <https://github.com/settings/personal-access-tokens/new>
2. **Resource owner:** Modern-Clinic-Services
3. **Repository access:** Only select repositories → `mtc-directory`
4. **Repository permissions:** Contents → **Read and write**, Metadata → Read-only (auto)
5. **Generate token** → copy it once

### 2. Pick a Webflow webhook secret

Generate any random ~32-char string (e.g. `openssl rand -hex 32`). You'll paste
the same value into the Worker secret AND into the Webflow webhook config.

### 3. Add `WEBFLOW_API_TOKEN` to GitHub Secrets

<https://github.com/Modern-Clinic-Services/mtc-directory/settings/secrets/actions>
→ **New repository secret** → name `WEBFLOW_API_TOKEN`, value = your fresh
Webflow CMS-read token.

### 4. Deploy the Worker

```bash
cd worker
npm install -g wrangler          # only first time
wrangler login                   # opens browser, sign in as Domains@ModernThyroidClinic.com
wrangler secret put WEBFLOW_WEBHOOK_SECRET   # paste the secret from step 2
wrangler secret put GITHUB_PAT               # paste the PAT from step 1
wrangler deploy
```

`wrangler deploy` prints the live URL, e.g.:

```
https://mtc-website-directory-update-hook.<your-subdomain>.workers.dev
```

You can sanity-check it with `curl <url>` — should respond
`mtc-website-directory-update-hook is alive`.

### 5. Configure the Webflow webhook

In Webflow Designer → **Site Settings → Integrations → Webhooks → Add Webhook**:

- **Trigger:** Collection Item Changed (and also: Created, Deleted, Unpublished, Site Publish — add one webhook per trigger; same URL and secret for all)
- **URL:** the workers.dev URL from step 4
- **Secret / Signing key:** the same secret from step 2

Save. Webflow will start signing every webhook with that secret, and the Worker
will verify it.

## How it filters

The Worker only forwards events that:

- have a valid HMAC signature, AND
- are within ±5 minutes of "now" (replay protection), AND
- target the **Directory** collection (`69ec1ea64d23f0cbe5590856`) OR are a
  Site Publish event.

Anything else returns `200 Ignored: <reason>` so Webflow doesn't retry.

## Troubleshooting

- `wrangler tail` shows live logs from the Worker
- The Action's run history is at <https://github.com/Modern-Clinic-Services/mtc-directory/actions>
- If a webhook ever gets dropped, the scheduled cron in the Action picks up the
  change within 6 hours — system is self-healing
