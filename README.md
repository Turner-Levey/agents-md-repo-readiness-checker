# AGENTS.md Repo Readiness Checker

Free, no-signup, browser-only checker for AGENTS.md drafts.

Live URL: https://agents-md-repo-readiness-checker.vercel.app/
Tiny Tool Town listing: https://www.tinytooltown.com/tools/agents-md-repo-readiness-checker/
No-Login pending listing: https://nologin.tools/tool/agents-md-repo-readiness-checker-vercel-app/
No-Login badge status: https://nologin.tools/badge/agents-md-repo-readiness-checker-vercel-app/
Dogfooded AGENTS.md example: https://agents-md-repo-readiness-checker.vercel.app/AGENTS.md

## What it checks

Paste an AGENTS.md draft and the checker scores whether the file gives coding agents enough repository context to work safely:

- setup and environment notes
- exact test, lint, type-check, and build commands
- repo map and ownership boundaries
- coding conventions and local patterns
- safety rules for secrets, migrations, generated files, and destructive commands
- PR and verification expectations
- root/nested scope cues
- maintenance cues for future changes

## Privacy

The checker runs entirely in the browser. It does not upload pasted text, does not require login, does not use analytics scripts, and does not use browser storage.

## Directory status

- Tiny Tool Town listing is public.
- No-Login route is public and pending review.
- No-Login badge route is public and pending verification.

## References

- AGENTS.md format: https://github.com/openai/agents.md
- Codex AGENTS.md guide: https://developers.openai.com/codex/guides/agents-md
- This repo's AGENTS.md example: https://agents-md-repo-readiness-checker.vercel.app/AGENTS.md

## Local check

```bash
npm run check
```

## License

MIT
