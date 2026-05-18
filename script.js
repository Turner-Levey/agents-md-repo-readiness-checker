const input = document.querySelector("#agents-input");
const analyzeButton = document.querySelector("#analyze-button");
const sampleButton = document.querySelector("#sample-button");
const clearButton = document.querySelector("#clear-button");
const scoreValue = document.querySelector("#score-value");
const scoreStatus = document.querySelector("#score-status");
const scoreMeter = document.querySelector("#score-meter");
const resultGrid = document.querySelector("#result-grid");
const fixList = document.querySelector("#fix-list");
const reportOutput = document.querySelector("#report-output");
const copyReportButton = document.querySelector("#copy-report");
const downloadReportButton = document.querySelector("#download-report");

const sampleAgents = `# AGENTS.md

## Dev environment tips
- Use pnpm install from the repo root.
- Use pnpm --filter web dev for the Next.js app.
- The API package reads .env.example for required variable names.

## Project map
- apps/web is the customer dashboard.
- packages/db owns migrations and generated types.
- packages/ui contains shared design components.

## Testing instructions
- Run pnpm lint before opening a PR.
- Run pnpm test --filter web for app changes.
- Run pnpm typecheck when touching shared TypeScript packages.
- Run pnpm build before merging routing or config changes.

## Coding conventions
- Keep server-only database access inside packages/db.
- Prefer existing UI primitives before adding new components.
- Do not edit generated files under packages/db/generated.

## Safety boundaries
- Never print secrets from .env files.
- Do not run destructive database commands without explicit human approval.

## PR instructions
- Include a short summary, verification commands, and screenshots for UI changes.
- Add or update tests for changed behavior.`;

const checks = [
  {
    id: "setup",
    title: "Setup",
    weight: 14,
    description: "Install, runtime, environment, and package manager guidance.",
    tests: [
      /\b(npm|pnpm|yarn|bun|pip|uv|poetry|cargo|go|bundle|composer)\s+(install|sync|setup|add|ci)\b/i,
      /\b(env|environment|setup|bootstrap|dev server|local)\b/i
    ],
    fix: "Add repo-root setup steps: package manager, install command, environment file, and local service startup."
  },
  {
    id: "commands",
    title: "Commands",
    weight: 18,
    description: "Exact lint, test, type-check, and build commands.",
    tests: [
      /\b(test|vitest|jest|pytest|rspec|go test|cargo test)\b/i,
      /\b(lint|eslint|ruff|clippy|golangci-lint)\b/i,
      /\b(build|typecheck|tsc|mypy|check)\b/i
    ],
    fix: "List the exact commands agents should run for tests, linting, type checks, and builds."
  },
  {
    id: "map",
    title: "Repo map",
    weight: 12,
    description: "Directories, ownership boundaries, and generated artifacts.",
    tests: [
      /\b(apps?|packages?|src|server|client|api|web|lib|services|components|infra|migrations)\//i,
      /\b(generated|owned|ownership|directory|folder|module|package|monorepo)\b/i
    ],
    fix: "Add a short repo map with important folders, ownership boundaries, and generated files."
  },
  {
    id: "style",
    title: "Conventions",
    weight: 12,
    description: "Coding style, local patterns, and abstraction guidance.",
    tests: [
      /\b(convention|style|pattern|prefer|avoid|naming|format|component|helper|abstraction)\b/i,
      /\b(existing|shared|reuse|local pattern|design system|schema)\b/i
    ],
    fix: "Document the code conventions agents should preserve, including preferred helpers and patterns."
  },
  {
    id: "safety",
    title: "Safety",
    weight: 16,
    description: "Secrets, destructive actions, migrations, and production boundaries.",
    tests: [
      /\b(secret|token|credential|private key|\.env|password)\b/i,
      /\b(do not|never|avoid|destructive|reset|drop|migration|production|approval)\b/i
    ],
    fix: "Add explicit safety boundaries for secrets, migrations, production data, and destructive commands."
  },
  {
    id: "review",
    title: "Review",
    weight: 12,
    description: "PR format, verification notes, and test expectations.",
    tests: [
      /\b(PR|pull request|review|merge|commit|summary|verification)\b/i,
      /\b(add tests|update tests|screenshots|checklist|before merging)\b/i
    ],
    fix: "Add PR instructions: summary format, verification evidence, screenshots for UI, and test expectations."
  },
  {
    id: "scope",
    title: "Scope",
    weight: 8,
    description: "Root and nested AGENTS.md scope guidance.",
    tests: [
      /\b(AGENTS\.md|root|nested|subdirectory|scope|closer|override|directory-specific)\b/i
    ],
    fix: "Clarify whether this file applies repo-wide and when nested AGENTS.md files should override it."
  },
  {
    id: "maintenance",
    title: "Maintenance",
    weight: 8,
    description: "When to update AGENTS.md as the repo changes.",
    tests: [
      /\b(update|maintain|when changing|architecture|script|workflow|dependency|last updated)\b/i
    ],
    fix: "Add a maintenance rule: update AGENTS.md when scripts, architecture, dependencies, or workflows change."
  }
];

function countMatches(markdown, expressions) {
  return expressions.reduce((count, expression) => count + (expression.test(markdown) ? 1 : 0), 0);
}

function getSections(markdown) {
  return [...markdown.matchAll(/^#{1,3}\s+(.+)$/gm)].map((match) => match[1].trim());
}

function getCommandCount(markdown) {
  const inlineCommands = markdown.match(/`[^`]*(npm|pnpm|yarn|bun|pip|uv|poetry|cargo|go test|pytest|vitest|jest|make)[^`]*`/gi) || [];
  const bulletCommands = markdown.match(/^\s*-\s+.*\b(npm|pnpm|yarn|bun|pip|uv|poetry|cargo|go test|pytest|vitest|jest|make)\b.*/gim) || [];
  return new Set([...inlineCommands, ...bulletCommands]).size;
}

function scoreCheck(markdown, check) {
  const hits = countMatches(markdown, check.tests);
  const ratio = Math.min(1, hits / check.tests.length);
  return {
    ...check,
    hits,
    points: Math.round(check.weight * ratio),
    max: check.weight,
    status: ratio === 1 ? "good" : ratio > 0 ? "warn" : "miss"
  };
}

function getStatus(score) {
  if (score >= 85) return "ready";
  if (score >= 65) return "needs edits";
  if (score >= 35) return "thin";
  return "not ready";
}

function buildReport(markdown, scoredChecks, score) {
  const sections = getSections(markdown);
  const commandCount = getCommandCount(markdown);
  const missing = scoredChecks.filter((check) => check.status !== "good");
  const lines = [
    "# AGENTS.md Readiness Report",
    "",
    `Score: ${score}/100 (${getStatus(score)})`,
    `Sections found: ${sections.length ? sections.join(", ") : "none"}`,
    `Command-like entries found: ${commandCount}`,
    "",
    "## Category scores",
    ...scoredChecks.map((check) => `- ${check.title}: ${check.points}/${check.max} (${check.status})`),
    "",
    "## Fix plan",
    ...(missing.length ? missing.map((check, index) => `${index + 1}. ${check.fix}`) : ["1. Keep this file current as repo scripts and architecture change."]),
    "",
    "## Suggested AGENTS.md additions",
    ...missing.slice(0, 5).map((check) => `- ${check.fix}`)
  ];

  if (!markdown.trim()) {
    lines.splice(2, 0, "Paste your AGENTS.md draft to generate a real report.");
  }

  return lines.join("\n");
}

function renderMiniCards(scoredChecks) {
  resultGrid.innerHTML = "";
  for (const check of scoredChecks) {
    const card = document.createElement("article");
    card.className = "mini-card";
    const title = document.createElement("strong");
    title.textContent = check.title;
    const badge = document.createElement("span");
    badge.className = `status-${check.status}`;
    badge.textContent = `${check.points}/${check.max}`;
    const detail = document.createElement("p");
    detail.textContent = check.description;
    card.append(title, badge, detail);
    resultGrid.append(card);
  }
}

function renderFixes(scoredChecks) {
  fixList.innerHTML = "";
  const missing = scoredChecks.filter((check) => check.status !== "good");
  const items = missing.length ? missing : [{
    fix: "The draft covers the core areas. Re-run this checker when repo scripts, architecture, or workflow change."
  }];

  for (const check of items.slice(0, 8)) {
    const item = document.createElement("li");
    item.textContent = check.fix;
    fixList.append(item);
  }
}

function analyze() {
  const markdown = input.value;
  const scoredChecks = checks.map((check) => scoreCheck(markdown, check));
  const rawScore = scoredChecks.reduce((sum, check) => sum + check.points, 0);
  const commandCount = getCommandCount(markdown);
  const sectionBonus = Math.min(4, getSections(markdown).length);
  const commandBonus = Math.min(4, commandCount);
  const score = markdown.trim() ? Math.min(100, rawScore + sectionBonus + commandBonus) : 0;
  const status = getStatus(score);

  scoreValue.textContent = String(score);
  scoreStatus.textContent = status;
  scoreMeter.style.width = `${score}%`;
  scoreMeter.style.background = score >= 85 ? "var(--green)" : score >= 65 ? "var(--yellow)" : score >= 35 ? "var(--yellow)" : "var(--red)";

  renderMiniCards(scoredChecks);
  renderFixes(scoredChecks);
  reportOutput.textContent = buildReport(markdown, scoredChecks, score);
}

function downloadReport() {
  const blob = new Blob([reportOutput.textContent || ""], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "agents-md-readiness-report.md";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function copyReport() {
  const text = reportOutput.textContent || "";
  if (!text.trim()) return;
  await navigator.clipboard.writeText(text);
  copyReportButton.textContent = "Copied";
  window.setTimeout(() => {
    copyReportButton.textContent = "Copy";
  }, 1200);
}

analyzeButton.addEventListener("click", analyze);
sampleButton.addEventListener("click", () => {
  input.value = sampleAgents;
  analyze();
});
clearButton.addEventListener("click", () => {
  input.value = "";
  analyze();
  input.focus();
});
downloadReportButton.addEventListener("click", downloadReport);
copyReportButton.addEventListener("click", () => {
  copyReport().catch(() => {
    copyReportButton.textContent = "Copy failed";
    window.setTimeout(() => {
      copyReportButton.textContent = "Copy";
    }, 1200);
  });
});

analyze();
