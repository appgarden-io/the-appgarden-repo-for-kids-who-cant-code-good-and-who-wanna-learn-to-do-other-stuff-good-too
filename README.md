# Prototype Template

A starter template for building polished demo apps to showcase to potential clients. Focused on rapid prototyping with high UI/UX fidelity.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 7](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Data Fetching | [TanStack Query](https://tanstack.com/query) |
| Forms | [TanStack Form](https://tanstack.com/form) |
| API Mocking | [MSW](https://mswjs.io/) (Mock Service Worker) |
| Validation | [Zod](https://zod.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Hugeicons](https://hugeicons.com/) |
| Linting & Formatting | [Ultracite](https://ultracite.js.org/) (Biome) |
| Git Hooks | [Husky](https://typicode.github.io/husky/) |
| Design Skills | [Impeccable](https://impeccable.style/#commands-section) |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Build for production
pnpm build

# Preview the production build
pnpm preview
```

## Project Structure

```
src/
  routes/          # File-based routes (auto-generates routeTree.gen.ts)
  components/
    ui/            # shadcn/ui components
  hooks/           # Custom React hooks
  lib/             # Utility functions
  mocks/
    browser.ts     # MSW browser worker setup
    handlers.ts    # Mock API request handlers
```

## Key Conventions

- **Routing** — Add new routes by creating files in `src/routes/`. The TanStack Router plugin auto-generates the route tree. Do not manually edit `routeTree.gen.ts`.
- **API Mocking** — All API endpoints are mocked with MSW. Mock handlers live in `src/mocks/handlers.ts` and include realistic delays.
- **Styling** — Use Tailwind CSS utility classes and shadcn/ui components exclusively.
- **Code Quality** — Ultracite (powered by Biome) handles linting and formatting. Run `pnpm fix` before committing.
- **Path Aliases** — Use `@/` to reference the `src/` directory (e.g. `@/components/ui/button`).

## Session Commands

This project includes two slash commands for Claude Code to bookend your coding sessions:

### `/start-session`

Prepares your local environment for a new coding session:

1. Checks for uncommitted changes and optionally commits them
2. Pulls the latest changes from the remote branch
3. Installs dependencies with `pnpm install`
4. Starts the Vite dev server (if not already running)

### `/end-session`

Wraps up your coding session cleanly:

1. Commits any uncommitted changes (creates a feature branch if on `main`)
2. Pushes the branch to the remote
3. Kills any running dev servers
4. Optionally deploys the current branch to Railway

## Code Quality

```bash
# Auto-fix formatting and lint issues
pnpm fix

# Check for issues without fixing
pnpm check
```
