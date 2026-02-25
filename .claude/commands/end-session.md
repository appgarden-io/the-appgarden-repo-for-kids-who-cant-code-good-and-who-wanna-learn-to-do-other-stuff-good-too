# End Session

Wrap up the coding session. Run through each step in order.

## Step 1: Commit changes

Run `git status` to check for any uncommitted changes.

- **If there are no changes**: skip to Step 2.
- **If there are changes**:
  - Check the current branch with `git branch --show-current`.
  - **If on `main`**: create a new branch before committing. Pick a descriptive branch name based on the work that was done (e.g., `feat/add-dashboard-layout`, `fix/sidebar-navigation`). Create and switch to the branch with `git checkout -b <branch-name>`.
  - **If already on a feature branch**: stay on it.
  - Stage all changes and commit with a meaningful commit message that summarizes the session's work.

## Step 2: Push to remote

Push the current branch to the remote with `git push -u origin <branch-name>`.

- If the push fails, report the error and ask the user how they'd like to proceed.

## Step 3: Kill dev servers

Find and kill any running Vite dev servers for this project:

```bash
lsof -i :5173
```

Kill any processes found listening on port 5173. Report what was stopped, or note that no dev server was running.

## Step 4: Sign off

Tell the user: "All done! Now do 8 pushups and head to bed."
