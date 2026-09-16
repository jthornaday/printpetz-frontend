# Generator Page Restructure — Full-Width Stacked Sections

## Goal
Replace the side-by-side modeler/picker layout just built (PR #23, branch `fix/generator-layout-double-generate`) with a single-column stack of three full-width sections, and move the gallery of past creations off this page entirely.

## Context
- This continues the same branch/PR as the layout + double-generate fix already built (PR #23, unmerged). Don't start a new branch.
- The double-generate guard from PR #23 must not be touched or regressed — it's already tested live and working (confirmed: blocked second batch, no double charge).
- Current page has: pet modeler (left column) + style picker with category tabs (right column) + a "No. of Generations" stepper / credit-cost summary / Generate button (bottom of left column) + a gallery of past creations (below both, per PR #23).
- New instruction supersedes PR #23's "side-by-side collapsing to stacked" layout — this is now always a single column, at every viewport width, not just on narrow screens.

## Done when
- [ ] Section 1, full width, top: the pet modeler (photo upload / model creation panel), functionally unchanged.
- [ ] Section 2, full width, below section 1: the style/theme picker, keeping its existing category tabs and the larger thumbnails from PR #23.
- [ ] Section 3, full width, below section 2: an "approve and generate" section — this replaces today's tucked-away "No. of Generations" stepper + credit cost + Generate button. It should show the user what they're about to pay for (their pet + selected style) and let them set the number of images to generate, with the cost and the Generate action right there, before any credits are charged.
- [ ] The gallery of the user's past creations is removed from this page entirely and appears instead on the existing History page (left nav).
- [ ] The double-generate guard (disabled/blocked second generation while one is in progress) still works exactly as it does now — verify by re-running the same live test as before (start one batch, try to start a second, confirm no double charge and no second batch fires).
- [ ] Layout holds up at both desktop and narrow/tablet widths — since it's a single column now, this should be simpler than the old side-by-side breakpoint logic, but confirm nothing overlaps or clips.

## Constraints
- Frontend-only. Do not touch `printpetz-backend`, Supabase schema, or credits/Stripe logic.
- Do not add, edit, or unhide any theme/style rows (Historical and Heroes stay parked, untouched).
- Preserve all existing generation, upload, and picker functionality — this is a layout restructure, not a rebuild.
- Don't lose or weaken the double-generate guard while restructuring where the Generate button lives.

## Free-edit files
- Same files touched in PR #23 (the generator page layout components) — continue editing there.
- Whatever component renders the History page, to receive the relocated gallery.
Everything else — Supabase schema/data, the backend repo, payment code, `.env`/secrets — still asks first.

## Out of scope
- Fixing Historical/Heroes theme render quality, or unhiding them.
- Adding any new themes/categories.
- Any backend changes.
- Redesigning the History page beyond adding the gallery content to it.

## Approach (suggested, not mandatory)
1. Restructure the generator page into three stacked full-width sections in this order: modeler, picker, approve-and-generate.
2. Pull the "No. of Generations" stepper, cost summary, and Generate button out of the left column and into their own full-width section 3, styled clearly as a confirm-before-you-pay step.
3. Remove the past-creations gallery from this page; move that rendering logic to the History page component instead.
4. Re-verify the double-generate guard still works after the Generate button moves — the guard logic shouldn't need to change, but confirm it's still wired to the same button/handler.
5. Manually check both desktop and narrow widths.

## House rules
- STOP at forks only (unexpected number, broken done-when, API spend, anything irreversible). Always STOP before any commit, push, or delete.
- Ask before touching credentials, .env files, secrets, or any production database.
- Prefer the simplest thing that passes every "Done when" check.
- If a "Done when" check turns out to be impossible or wrong, stop and say so rather than working around it.
- Finish by running through the "Done when" list and reporting pass/fail on each.

## Kick-off prompt
Read specs/generator-layout-full-width-restructure.md and execute it on the existing branch fix/generator-layout-double-generate. Follow the House rules exactly.
