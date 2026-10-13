# Sola Web

Sola is an intelligent English learning web application featuring personalized learning paths, AI tutoring, interactive exercises, exam prep (IELTS/TOEIC), and continuous progress tracking.

## Architecture Overview

This project is organized following modular architecture:
- `src/app/`: Next.js App Router (pages, layouts, route handlers only - no business logic).
- `src/modules/`: Business domains (state, models, api services, domain components).
- `src/widgets/`: Complex composite UI blocks (Sidebar, Header, AI Tutor panel, etc.).
- `src/shared/`: Reusable UI kit, utilities, generic hooks, and HTTP client.
- `src/styles/`: Design tokens, typography, and animation definitions.
- `src/mocks/`: Mock data for development and prototyping.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

### Commands

```bash
npm run lint        # ESLint via Next
npm run typecheck   # tsc --noEmit
npm test            # vitest (happy-dom), unit + DOM suites
npm run build       # Next production build
npm run test:e2e    # Playwright browser specs
```

### Reproducing the browser (e2e) setup

Playwright launches its **own** Next dev server on port `3100` (override with `TEST_PORT`),
never an already-running dev server. The specs need the browser binaries to be present:

```bash
# Install Chromium into the workspace cache used by this repo
PLAYWRIGHT_BROWSERS_PATH="$PWD/.cache/ms-playwright" npx playwright install chromium

# Run the e2e suite against that cache
PLAYWRIGHT_BROWSERS_PATH="$PWD/.cache/ms-playwright" npm run test:e2e
```

If the browser is installed somewhere else, point `PLAYWRIGHT_BROWSERS_PATH` at that
location instead — this workspace defaults to the cache above, so a plain
`npm run test:e2e` fails with a "browser not found" error until the cache exists.

The e2e server runs with `NEXT_PUBLIC_USE_MOCK_DATA=false` and
`NEXT_PUBLIC_API_URL=https://api.sola.test`, so the production domain adapters issue real
`fetch` calls that the specs intercept. Specs are split by viewport project (`mobile`,
`tablet`, `desktop`); the drawer specs skip the branches that do not apply at a given
width, and each skipped branch has a counterpart that runs in another project.

### Current verification status — read before trusting the numbers

- The **auth / AI / audio** features are explicitly simulated prototypes; they are not wired
  to real services and are not claimed to be production-ready.
- Phase 6 cleanup and repairs are documented in `plan.md`, including which results are
  **not** verified. In particular the second review round was **waived at the user's
  request**, so the latest repairs have **no independent approval**.
- `npm run lint` and `npm run build` were not re-run after the most recent repairs; treat
  their last green result as belonging to an earlier tree.
- Screenshots produced by the e2e specs are state captures for manual comparison only —
  there is no automated pixel comparison.
