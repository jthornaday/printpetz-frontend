# Generator Page Redesign + Double-Generation Fix

## Goal
Redesign the main generator page layout (pet modeler + style picker + gallery) so it's less cramped and easier to scan, and fix a bug where starting a second generation while one is still in progress leaves the UI broken.

## Done when
- [ ] The pet modeler (photo upload / model creation panel) stays in its current position on the left, functionally unchanged.
- [ ] The style/theme picker moves to sit to the right of the modeler (side-by-side on desktop widths), keeping its existing category tabs.
- [ ] Style picker thumbnails are noticeably larger than today's, so a user scrolling through a category can easily compare options at a glance.
- [ ] The gallery of the user's created images appears in a full-width row below both the modeler and the picker — not beside them.
- [ ] While a generation is in progress, the generate control is disabled/visibly inactive, and trying to trigger a second generation does nothing — no second request fires, no error appears, and the first generation's in-progress/result state is undisturbed.
- [ ] On a narrower viewport (e.g. tablet width), the layout stacks sensibly (modeler, then picker, then gallery) instead of overlapping or clipping.

## Context
- Repo: `printpetz-frontend`. The style/theme picker already has category tabs (added in PR #18, Sept 15) but is cramped now that there are 70+ themes across categories.
- A related prior fix exists at `specs/history-scroll-and-labelling.md` in this repo — same repo, same general class of frontend state-management bug (in-progress-item tracking / polling) was fixed there for the History page (`useInfiniteScroll` rewrite, group_id-based grouping). Worth checking there first for a shared root cause or reusable pattern before touching the generation-in-progress logic.
- The double-generation bug, as observed: user starts generation #1, and before it finishes, tries to start #2. Result: the first generation's display stays frozen/unchanged, and an error appears on screen. It is not yet known whether a second generation was actually created or charged server-side despite the broken UI — check this as part of diagnosis. (PrintPetz recently had a real billing bug where failed saves still charged credits — see `claude/generator-fix-log-2026-09-16.md`-equivalent incident — so don't assume a UI-level bug can't have a billing-side symptom too.)
- PrintPetz is in R&D mode, no real customers yet — this is quality-of-life and correctness work, not a live incident.

## Constraints
- Frontend-only change. Do not touch the `printpetz-backend` repo, Supabase schema, or Stripe/credits logic.
- Do not add, edit, or unhide any theme/style rows. Historical and Heroes categories are intentionally parked (see `claude/theme-expansion-backlog.md` and `claude/generator-fix-log-2026-09-13.md`) due to poor render quality on FLUX — leave them exactly as they are.
- Simplest fix for the concurrency bug: prevent a second generation from starting while one is in progress (disable the control / block the action). Do not attempt to build true parallel-generation support — that's explicitly out of scope.
- Preserve all existing generation, upload, and picker functionality. This is a layout change plus a guard-rail fix, not a rebuild.

## Free-edit files
- Whatever frontend component(s) render the generator page layout (modeler, style picker, gallery) — locate by searching the repo for the relevant component/route names.
- Whatever hook/component manages generation-in-progress state and the generate action's handler.
Everything else — Supabase schema/data, the backend repo, payment code, `.env`/secrets — still asks first.

## Out of scope
- Fixing Historical/Heroes theme render quality, or unhiding them.
- Adding any new themes/categories (Sports remainder, Holidays, etc. from the backlog).
- True parallel/concurrent generation support.
- Redesigning the History page or My Pets page.
- Any backend changes.

## Approach (suggested, not mandatory)
1. Find the generator page's component tree: the modeler, style picker, and gallery components/routes.
2. Restructure the layout: a two-column row (modeler left, picker right) above a full-width gallery row below. Increase the picker's thumbnail size/grid sizing; keep the existing category tabs.
3. Add a responsive breakpoint so the two-column row stacks vertically (modeler, then picker) on narrow viewports, with the gallery still below both.
4. Find where "generate" is triggered and where generation-in-progress state lives (check the History-page fix's polling/state pattern first, in case it's shared or analogous). Add a guard: disable the generate control (and/or ignore the click) while a generation is in progress for that session.
5. Manually reproduce the original bug (start one generation, immediately try to start a second) before and after the fix, to confirm it's actually resolved and not just visually papered over.
6. Check whether the bug could have let a second request through server-side even while the UI looked broken. If there's any chance a second generation was ever actually created or charged this way, flag it to Jake rather than silently closing the ticket.

## House rules
- STOP at forks only (unexpected number, broken done-when, API spend, anything irreversible). Always STOP before any commit, push, or delete.
- Ask before touching credentials, .env files, secrets, or any production database.
- Prefer the simplest thing that passes every "Done when" check. Eliminate redundancy; do not add features not listed above.
- If a "Done when" check turns out to be impossible or wrong, stop and say so rather than working around it.
- Finish by running through the "Done when" list and reporting pass/fail on each.

## Kick-off prompt
Read specs/generator-layout-and-double-generate-fix.md and execute it. Follow the House rules exactly.
