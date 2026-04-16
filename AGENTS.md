# Repository Guidelines

## Project Structure & Module Organization
Core app code lives in `src/`. Keep feature logic close to its domain:
- `src/apps/` for in-game desktop apps (`flack`, `outbox`, `synergy`, etc.)
- `src/components/` for shared and UI components (dialogue, game, menu, notifications)
- `src/player/` for game state, hidden flags, and day/event flow (`src/player/events/`)
- `src/scenarios/meridian/` for scenario content (NPCs, documents, company data)
- `docs/SPEC.md` for product/design behavior, `TESTING_GUIDE.md` for manual QA
- `public/` for static assets, `electron/` and `src-tauri/` for desktop wrappers

## Build, Test, and Development Commands
- `npm install` installs dependencies.
- `npm start` runs the Vite dev server (local web development).
- `npm run build` creates a production build in `dist/`.
- `npm run ghbuild` builds with `CI=false` for CI-hosted environments.
- `npm run electron:dev` runs web + Electron together for desktop dev.
- `npm run electron:build` builds web assets and packages Electron output.
- `npm run prettier` formats the repository.

## Coding Style & Naming Conventions
Use React function components and keep files focused. Current code style uses:
- 2-space indentation, semicolons, double quotes
- `PascalCase` for React component files (`DaySummary.tsx`)
- `camelCase` for variables/functions, `kebab-case` for `.scss` filenames
Prefer colocated styles (`component.scss`) and avoid introducing a new pattern when one already exists nearby.

## Testing Guidelines
Automated test infrastructure is not currently set up for app code. Follow `TESTING_GUIDE.md` for manual scenario testing and regression checks.
- Validate event timing, dialogue branches, and hidden-state mutations.
- Use browser console checks when needed (for example `window.store.getState().player.hiddenState`).
Document manual test steps and outcomes in PRs for gameplay changes.

## Commit & Pull Request Guidelines
Commit messages in this repo are short, imperative, and descriptive (examples: `Add NPC follow-up responses and delays`, `fix: add safeguards for app state ...`).
- Prefer: `Area: concise action` or `fix: concise action`.
- Keep each commit focused on one logical change.
PRs should include:
1. What changed and why.
2. Affected gameplay paths/apps.
3. Manual test evidence (steps + results).
4. Screenshots/GIFs for UI/dialogue flow changes.
