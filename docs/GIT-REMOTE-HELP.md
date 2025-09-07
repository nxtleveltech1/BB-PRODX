Git remote and push help (Windows PowerShell)

Problem observed:
- Commands broke because the URL and repo name were split across lines and a stray token (BetterBeingProd.git) appeared on its own line.
- Example errors: "The term 'BetterBeingProd.git' is not recognized" and "fatal: No such URL found: BetterBeingProd.git".

Correct one-liners (replace placeholders):

1) Temporarily set origin with token, push, then restore clean URL:

  # Set token remote (single line!)
  git remote set-url origin https://<USERNAME>:<TOKEN>@github.com/<OWNER>/<REPO>.git
  # Push default branch first (e.g., main)
  git push -u origin main --force-with-lease
  # Push all branches
  git push origin --all --force-with-lease
  # Push tags
  git push origin --tags
  # Restore to a clean URL (no credentials)
  git remote set-url origin https://github.com/<OWNER>/<REPO>.git

Example for this repo:
  git remote set-url origin https://gazbew:<TOKEN>@github.com/gazbew/BetterBeingProd.git
  git push -u origin main --force-with-lease
  git push origin --all --force-with-lease
  git push origin --tags
  git remote set-url origin https://github.com/gazbew/BetterBeingProd.git

Notes:
- Do not break these commands across lines unless you use PowerShell backtick (`) line continuation carefully. A stray fragment like "BetterBeingProd.git" on its own line will be treated as a command.
- Consider using the helper script: scripts\set-remote-and-push.ps1
- Avoid leaving tokens in remotes. Always restore to a clean HTTPS remote afterwards.
