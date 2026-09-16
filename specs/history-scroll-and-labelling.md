# History: reachable, readable, honest

## Goal
Every generation a customer has paid for can be found by scrolling, and they can tell which pet, which style and which day each one is without clicking it.

## Done when
- [ ] With the browser window **shorter than 850px**, the bottom of History is reachable by ordinary scrolling, and landing, login and one other protected page still lay out correctly at 600px, 850px and 1200px tall.
- [ ] Scrolling to the bottom of History reliably loads the next page, including immediately after a previous page has just loaded.
- [ ] Every History tile has an always-visible caption strip below the image reading `<pet> · <style>` (e.g. `Wizard · Lacrosse`). Create page tiles are unchanged.
- [ ] A generation still in progress appears as a spinner in History, rather than vanishing.
- [ ] Date headings read `Today` / `Yesterday` / `Mon 15 Sep` in the viewer's local timezone (year appended only when not the current year), never a bare `2026-09-13`. A null or malformed date shows a fallback heading instead of blanking the page.
- [ ] A batch's heading always agrees with its position in the list: no group sits under a date heading that is out of order with the headings around it.

## Context

All the defects below were found on 15–16 Sept while trying to find a batch of images that turned out to be present, correct, and unreachable. The data was right at every layer (table, view, payload, DOM), and it still took most of a night, because each defect hides the evidence for the next one.

**1. The app shell clips its own bottom.** `PageWrapper.tsx:25-29`:
```tsx
<div className="min-h-screen overflow-hidden ...">
  <div className={cn("h-screen min-h-[850px]", className)}>
```
On a viewport shorter than 850px the inner shell is taller than the window, and the parent's `overflow-hidden` clips the excess with no scrollbar anywhere to reach it. This affects every `protected` page, not just History. On History it clips the bottom of the `overflow-y-auto` list, which is exactly where the infinite-scroll sentinel lives, so the sentinel can sit permanently in the dead zone.

**2. `useInfiniteScroll` observes the wrong thing, and keeps destroying itself.** `useInfiniteScroll.ts:31`:
```ts
new IntersectionObserver(cb, { threshold })   // no `root` -- defaults to the viewport
```
The sentinel lives inside a scrolling div, so the root should be that container. As written, the trigger depends on where the container sits in the viewport rather than on its own scroll position, which is precisely what defect 1 breaks.

And `onLoadMore` is `() => fetchNextPage()`, an inline arrow in `History/index.tsx:44`. It gets a new identity on every render and sits in the dependency array (`:53`), so the observer is torn down and rebuilt constantly. The early return at `:27` means **no observer exists at all while a fetch is in flight**. Reaching the bottom during that window does nothing.

**3. Tiles carry no identity.** `GenerationItem` renders the image and nothing else. Pet and style appear only in `GenerationPreviewDialog`, on click. History groups by date only, so one date block interleaves every pet and every style. With four pets, "where are my Lacrosse images?" can't be answered without clicking tiles one at a time. That question cost hours. `generationView.model` (`pet_name: string | null`, `name`) and `generationView.style.name` are already in scope at the render site (`index.tsx:113-126`).

**4. In-progress generations disappear.** `History/index.tsx:62` drops a view whose generations are all `GENERATING` when creating a date group, and `:110` filters generating rows out at render. Meanwhile `GenerationItem:23` has a working spinner for exactly that state, and History can never reach it. A stuck generation leaves no trace: no spinner, no error, no tile.

**5. Date headings are raw, UTC-mixed, and can crash the page.** `formatDateForDisplay` (`app_utils.ts:16-35`) returns a bare `YYYY-MM-DD` for anything older than yesterday. It compares dates through `toISOString()`, i.e. in UTC, while the "yesterday" arithmetic runs in local time, so a US-evening batch lands on the wrong day. `toISOString()` is unguarded: `new Date("2026-09-15T03:15:39.083+00")` (two-digit offset) is an Invalid Date and `toISOString()` throws `RangeError`. The call runs inside the reduce in a `setTimeout`, so one bad row means `setGenerationViewsGroupedByDate` is never called and **the whole history renders empty**.

**6. Heading date and list order come from different fields.** The list is ordered by `group_id` (`generationApi.ts:81`) but labelled by the view's `created_at` (`index.tsx:52`). Grouping uses `acc.find` by heading string, so headings are not guaranteed to follow sort order.

Related symptom, **not explained**: on 15 Sept a group showed the heading `2026-09-13` while its `group_id` decoded to 15 Sept. On 16 Sept the owner ran read-only checks in Supabase. No `generations` row and no `generation_view` row has `created_at` more than an hour from its `group_id`, and the only trigger on `generations` is BEFORE UPDATE and leaves `created_at` alone. So there is no backend or data mismatch today. But no frontend bug found so far explains a two-day gap either:
- The UTC/local mix in defect 5 moves a date by at most one day.
- `acc.find` puts a view in the block matching its *own* heading, so it can put a block in the wrong place but can't give a view the wrong date.

The likeliest remaining explanations: the tile was matched to the wrong heading while defects 1 and 6 made the list hard to read, or the rows changed between 15 and 16 Sept. The fixes for defects 5 and 6 are expected to make this impossible, but that is unverified. **If, during the build, any tile's heading differs from its batch's `group_id` date by more than one day, STOP. That's a fork.**

## Constraints
- `PageWrapper` wraps every page. Changing the shell affects landing, auth and protected layouts, so check all three, not just History.
- Do not change `generation_view`, the API query, the database, or anything in `printpetz-backend`. Every defect here is fixable in the frontend.
- `GenerationItem` is shared with the Create page (`Create/components/Generations`). The caption must be opt-in via a prop, so Create renders exactly as before.
- Pet label: `model.pet_name`, falling back to `model.name` when null.

## Free-edit files (printpetz-frontend)
- `src/components/layout/PageWrapper.tsx`
- `src/hooks/useInfiniteScroll.ts`
- `src/components/pages/History/index.tsx`
- `src/components/pages/shared/GenerationItem/index.tsx`
- `src/utils/app_utils.ts`

Anything else asks first.

## Out of scope
- Any change to `generation_view` or `generations` data (both checked on 16 Sept and consistent with `group_id`).
- Grouping History by pet or style instead of by date.
- Search or filtering.
- Labels on the Create page.
- The queued-generation work in backend PR #38 (`feat/openai-generation-queue`).

## Approach (suggested, not mandatory)
- Drop `min-h-[850px]`, or move the scrolling to an ancestor that actually scrolls. The floor exists to stop the layout collapsing on short screens, so whatever replaces it must not put content outside a scrollable region.
- Give the observer an explicit `root` (pass the scroll container's ref into the hook) and wrap `onLoadMore` in `useCallback` in `History`. Keep the observer attached during fetches and ignore callbacks while fetching, rather than tearing it down, or re-check intersection when a fetch finishes.
- Add an optional `caption` prop to `GenerationItem`, rendered as a single truncated line below the `aspect-[4/5]` image box. History passes it; Create doesn't.
- Let `GENERATING` rows through both History filters and let `GenerationItem` draw its existing spinner.
- Rewrite `formatDateForDisplay` to compare local calendar days, format older dates with `toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })` (+ year when not current), normalise a two-digit UTC offset before parsing, and return a fallback like `Earlier` for an invalid date instead of throwing.
- Build headings from `new Date(generationView.group_id)`, the same field the list is sorted by, so a heading can't disagree with list order. The data shows `group_id` and `created_at` agree, so dates don't change; order just can't diverge.

**Sharpest risk:** defect 1 is in the shell, so a careless fix breaks every page. Verify landing, login and a protected page at several window heights, particularly below 850px, where the bug lives and where nobody has been testing.

## House rules
- STOP at forks only (unexpected number, broken done-when, API spend, anything irreversible). Always STOP before any commit, push, or delete.
- Ask before touching credentials, .env files, secrets, or any production database.
- Prefer the simplest thing that passes every "Done when" check. Eliminate redundancy; do not add features not listed above.
- If a "Done when" check turns out to be impossible or wrong, stop and say so rather than working around it.
- Finish by running through the "Done when" list and reporting pass/fail on each.

## Kick-off prompt
Read specs/history-scroll-and-labelling.md and execute it. The code changes go in the printpetz-frontend repo (`~/Documents/GitHub/printpetz-frontend`), not the backend. Follow the House rules exactly.
