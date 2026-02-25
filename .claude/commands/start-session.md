# Start Session

Prepare the local environment for a new coding session. Run through each step in order, pausing for user input where noted.

## Step 1: Ensure clean git state

Run `git status` to check for uncommitted changes (staged, unstaged, or untracked files).

- **If the working tree is clean**: report that there are no uncommitted changes and move on.
- **If there are changes**: show the user a summary of what's changed (modified files, untracked files, staged changes) and ask whether they'd like to commit these changes before continuing. If yes, follow the standard commit workflow (stage, draft message, commit). If no, move on — but warn that pulling may cause conflicts with uncommitted changes.

## Step 2: Pull latest changes from remote

Run `git pull` to fetch and merge the latest changes from the tracked remote branch.

- **If the pull succeeds cleanly**: report success and move on.
- **If there are merge conflicts**: list the conflicted files and open each one to understand the conflict. For straightforward conflicts (e.g., one side added a line, the other didn't touch it), resolve them automatically. For ambiguous conflicts where both sides made meaningful changes, show the user both versions and ask which to keep (or how to combine them). After resolving all conflicts, complete the merge commit.
- **If there's no remote tracking branch or remote is unreachable**: report the issue and continue with the remaining steps rather than blocking the whole session.

## Step 3: Install dependencies

Run `pnpm install` to ensure all dependencies are up to date. This catches any new packages added by teammates since the last session.

- Report the result (success, warnings, or errors).
- If install fails, show the error and ask the user how they'd like to proceed.

## Step 4: Start the dev server

First, check if a dev server is already running by looking for a process listening on the default Vite port (5173):

```bash
lsof -i :5173
```

- **If a server is already running**: report that the dev server is already active and skip starting a new one.
- **If no server is running**: start the dev server in the background with `pnpm dev` and confirm it's up.
