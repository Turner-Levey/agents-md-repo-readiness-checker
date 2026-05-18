# AGENTS.md

## Project Scope

This repository is a static, browser-only web tool for checking AGENTS.md repo-instruction drafts.

Public site: https://agents-md-repo-readiness-checker.vercel.app/

## File Map

- `index.html` contains page structure, metadata, JSON-LD, and static links.
- `styles.css` contains all visual styling.
- `script.js` contains the local-only checker logic and report export behavior.
- `README.md` describes the public tool and directory status.
- `llms.txt` gives crawler-readable tool context.
- `sitemap.xml`, `robots.txt`, and `771d71868dbb66bdf5c15a0ebe1e4054.txt` support discovery and IndexNow.
- `submit-indexnow.mjs` submits changed public URLs after verified owned-content changes.

## Local Commands

Run this before committing JavaScript changes:

```bash
npm run check
```

There is no build step. Vercel serves the static files directly.

## Privacy And Tracking Rules

- Keep the tool no-signup and browser-only.
- Do not upload pasted AGENTS.md text to any server.
- Do not add analytics, tracking pixels, cookies, local storage, session storage, or telemetry beacons.
- Keep third-party links as normal outbound links only.

## Content Rules

- Keep claims factual: no signup, no tracking, browser-only, MIT source, and current public listing status only when verified.
- Do not claim official OpenAI affiliation.
- Do not add legal, security-remediation, revenue, usage, or social-proof claims.
- If a directory listing is only pending review, label it as pending.

## Change Checklist

- Update `README.md` and `llms.txt` when public positioning, listing status, or source references change.
- Update `sitemap.xml` when adding or removing public routes.
- Verify public root, `llms.txt`, sitemap, robots, key file, assets, and `script.js` after deployment.
- Submit IndexNow only after an owned public URL changes or a verified listing/status creates a real update reason.
