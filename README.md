<img width="299" height="168" alt="image" src="https://github.com/user-attachments/assets/0a357caf-910e-4e93-8e77-4c4c08391576" />

<img width="400" height="164" alt="image" src="https://github.com/user-attachments/assets/ddc1b674-aa88-4f24-9a32-c574b4422c88" />

# The Prototype Template

What is this? A template for ants? No. It's a template for building really, really, ridiculously good-looking demo apps. I'm serious. These demos are so hot right now.

I wasn't sure what a "starter template" was at first but my friend Hansel explained it and now I totally get it. It's like a blueprint... but for computers. And it helps you showcase apps to potential clients who probably can't even turn left.

## The Tech Stack (It's Beautiful)

| What It Does | What It's Called (I Had Help With This Part) |
|---|---|
| The Brain Stuff | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| The Build Thingy | [Vite 7](https://vite.dev/) |
| Making It Pretty | [Tailwind CSS 4](https://tailwindcss.com/) |
| The UI Bits | [shadcn/ui](https://ui.shadcn.com/) |
| Going Places | [TanStack Router](https://tanstack.com/router) (file-based, whatever that means) |
| Getting Data | [TanStack Query](https://tanstack.com/query) |
| Filling Out Forms | [TanStack Form](https://tanstack.com/form) |
| Fake API Stuff | [MSW](https://mswjs.io/) (Mock Service Worker... it's like a eugoogly for real APIs) |
| Making Sure Things Are Right | [Zod](https://zod.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Little Pictures | [Hugeicons](https://hugeicons.com/) |
| Keeping Code Clean | [Ultracite](https://ultracite.js.org/) (Biome) |
| Git Hooks | [Husky](https://typicode.github.io/husky/) |
| Design Skills | [Impeccable](https://impeccable.style/#commands-section) |

## Getting Started (It's So Simple Even Hansel Could Do It)

```bash
# Install the dependencies. But why male models?
pnpm install

# Start the dev server. It's like a walk-off but for code.
pnpm dev

# Build for production. Blue Steel mode.
pnpm build

# Preview the production build. Le Tigre mode.
pnpm preview
```

## Project Structure (The Files Are IN the Computer)

```
src/
  routes/          # Where the pages live (auto-generates routeTree.gen.ts)
  components/
    ui/            # Really really ridiculously good-looking components
  hooks/           # Custom React hooks (not the Captain Hook kind)
  lib/             # Utility functions and other brainy stuff
  mocks/
    browser.ts     # MSW browser worker setup
    handlers.ts    # Mock API request handlers (the fake stuff)
```

## Key Conventions (The Rules of the Walk-Off)

- **Routing** — Add new routes by creating files in `src/routes/`. The TanStack Router plugin auto-generates the route tree. Do NOT manually edit `routeTree.gen.ts`. That's like using a cell phone during a walk-off. You just don't do it.
- **API Mocking** — All API endpoints are mocked with MSW. Mock handlers live in `src/mocks/handlers.ts` and include realistic delays. Because even fake data deserves a dramatic entrance.
- **Styling** — Use Tailwind CSS utility classes and shadcn/ui components exclusively. One look. One framework. That's all you need.
- **Code Quality** — Ultracite (powered by Biome) handles linting and formatting. Run `pnpm fix` before committing. Moisture is the essence of wetness, and formatting is the essence of code quality.
- **Path Aliases** — Use `@/` to reference the `src/` directory (e.g. `@/components/ui/button`). It's like a shortcut. For computers.

## Session Commands (The Zoolander Center for Developers Who Can't Code Good)

This project includes two slash commands for Claude Code to bookend your coding sessions. They're like the opening and closing of a really great runway show.

### `/start-session`

Prepares your local environment. It's like getting ready backstage before the show:

1. Checks for uncommitted changes and optionally commits them (gasoline fight optional)
2. Pulls the latest changes from the remote branch
3. Installs dependencies with `pnpm install`
4. Starts the Vite dev server (if not already running)

### `/end-session`

Wraps up your coding session. The lights go down. The music fades. Beautiful:

1. Commits any uncommitted changes (creates a feature branch if on `main`)
2. Pushes the branch to the remote
3. Kills any running dev servers
4. Optionally deploys the current branch to Railway

## Code Quality (Blue Steel Level)

```bash
# Auto-fix formatting and lint issues. Magnum.
pnpm fix

# Check for issues without fixing. Le Tigre.
pnpm check
```

---

*This template is really, really, ridiculously good-looking. And that's not just my opinion. It's science. Or... computers. Same thing.*
