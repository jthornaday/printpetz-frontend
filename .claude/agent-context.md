---
applicable: yes
---

# PrintPetz frontend — agent context

**Read `CLAUDE.md` (this repo) and `../CLAUDE.md` (workspace root) first.** They hold the
stack map, UI direction, and the regression list. This file only adds the agent framing.

- R&D mode: no real customers yet, and a lot to do before real customers are a concern
  (confirmed by owner, 2026-09-16). Don't treat changes as customer-impacting.
- There is a live deployed site: merges to `main` auto-deploy to printpetz.com via AWS
  Amplify (GitHub push webhook; no PR checks run first).
- Backend is a separate repo sitting alongside this one:

```
~/Documents/PrintPetz_Github_Master/
  printpetz-frontend/       <- this repo (Next.js 15, pages router)
  printpetz-backend/        <- Express + TS API, AWS Elastic Beanstalk
  printpetz_backend_stale/  <- DEAD. Never read for truth, never edit.
```

  Older notes referred to `~/Documents/GitHub/printpetz-frontend` and
  `~/Downloads/printpetz-frontend-quality-update`. Both are obsolete.
- Data/auth: Supabase. Never commit, push, or merge — hand Jake the commands.
