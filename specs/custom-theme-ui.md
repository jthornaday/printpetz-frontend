# Custom-theme UI: "Create Your Own Template"

## Goal
Let a customer type a short description (and optionally upload a reference photo) at the bottom of Step 02 on the Create page, and generate their pet in that custom scene using the trademark-gated backend that's already built and live-tested.

## Done when
- [ ] At the bottom of the Step 02 "Their Picture" section on the Create page, below the existing theme grid/search, there's a new "Create Your Own Template" section with a description textarea and an optional reference-photo upload.
- [ ] Typing a description (3-300 chars) and clicking Generate calls `POST /generation/create-custom` with `{ description, referencePhotoUrl?, modelId, numberOfImages, cutenessLevel }` and behaves like a normal generation from then on (queues, shows in the Step 03 review panel, appears in Gallery).
- [ ] A description outside 3-300 characters disables Generate with a visible character counter/hint; no request is sent for invalid input.
- [ ] Uploading a photo calls the existing `POST /file/upload` flow, and the resulting URL is sent as `referencePhotoUrl`. Generate works fine with no photo uploaded at all.
- [ ] While the request is in flight, the Generate button shows a "Checking..." loading state (the trademark classification call takes a few seconds before anything else happens server-side).
- [ ] A request that gets trademark-blocked (`errorName: "TRADEMARK_BLOCKED"`, e.g. asking for Spider-Man) shows the backend's own `errorDescription` message inline near the description box (not just a generic toast), makes clear no credits were charged, and leaves the description text in place so the customer can edit and retry.
- [ ] Selecting "Create Your Own Template" and typing a description does not select any `IStyle` from the theme grid — Step 03's review panel shows the custom description text where it currently shows the theme name/thumbnail, and the Generate button's copy adapts accordingly (no `selectedStyle` is required to enable it; a description takes its place).
- [ ] The hidden `'Custom'` style row (id 72) stays `is_active: false` in the DB — nothing in this build touches it or exposes it in the browsable theme grid.
- [ ] `tsc --noEmit` clean.

## Context
- Backend is done and live-tested — do not touch it except the one small addition below. `POST /generation/create-custom` (printpetz-backend `src/controllers/generation_controller.ts`, `createCustomImage`) already: runs the trademark check first (no charge, no image call on a block), validates via `generateCustomImageSchema` (printpetz-backend `src/utils/validation/generation_validation_schema.ts`: `description` string 3-300 chars trimmed, `referencePhotoUrl` optional URL, `modelId` number, `numberOfImages` 1-4, `cutenessLevel` int 1-5 default 1, `seed` optional), checks credits (403 if insufficient), looks up the hidden Custom style row internally, blocks if the user already has generations in progress, and returns the same `{ data: { generations } }` shape as the normal `/generation/create` on success.
- Trademark block error shape: `Api400Error` with `errorName: "TRADEMARK_BLOCKED"` and `errorDescription` already formatted as a full sentence for display, e.g. `"We can't make this one: <reason> Please describe something original instead. You haven't been charged."` Show this string as-is near the input; don't rewrite it.
- File upload already has a working, reusable path: `useUploadFileMutation` (printpetz-frontend `src/store/api/fileApi.ts`) posts to `file/upload?type=<EUploadPath>` as multipart and returns a URL. No existing `EUploadPath` value fits a custom reference photo semantically (`PROFILE_IMAGE`, `GENERATION_IMAGE`, `TRAINING_IMAGE`, `MODEL` — printpetz-backend `src/types/aws.ts`) — add one: `CUSTOM_REFERENCE = "custom-reference/[USER_ID]"`. This is the one backend touch this spec allows (see Free-edit files).
- Create page structure (printpetz-frontend `src/components/pages/Create/index.tsx`): Step 02 is the `#studio-theme` section, currently just `<StyleSelector selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle}/>`. Step 03 review panel reads `selectedStyle?.name` / `selectedStyle?.image` and disables Generate via `isGenerateButtonDisabled = !selectedModel || !selectedStyle || isGenerating`. `handleGenerate` currently always calls `useGenerateImageMutation` (`generationApi.ts`) with `styleId: selectedStyle.id`.
- No `generateCustomImage` mutation exists on the frontend yet — this spec adds one, mirroring `generateImage` in `src/store/api/generationApi.ts` but posting to `generation/create-custom` with `description`/`referencePhotoUrl` instead of `styleId`.
- Jake's decision: this section goes at the bottom of Step 02, below the existing theme grid — not a tab that replaces it, not a separate page/step. Label it "Create Your Own Template". Launch to all users immediately, no feature flag.
- Reference photo is optional. Image count / credit controls are the same as the normal flow — reuse `GenerationControls` and the existing 1-4 picker, no special-casing.

## Constraints
- Stack: Next.js/React/Redux Toolkit Query frontend, Express/TS backend, matching existing patterns in the files named above.
- Do not modify `trademark_service.ts`, the `createCustomImage` controller, or `generateCustomImageSchema` — they're built and tested. The only backend touch allowed is adding the one `EUploadPath.CUSTOM_REFERENCE` enum value (and using it in the upload call).
- Do not flip `styles.is_active` for the Custom row (id 72) or otherwise change it — it must stay hidden from the browsable theme grid. This is a data change; if it's ever needed, it's a one-line SQL Jake runs himself, not part of this build.
- Do not touch the model-picker/model-selector, Gallery, or the normal (non-custom) generate flow beyond what's needed to let `handleGenerate` branch between the two mutations.
- Known repo issue, not caused by this work: a stale `.git/index.lock` in `printpetz-frontend` blocked branch operations when this spec was being written. Delete that file first if `git checkout`/`git branch` refuses to run.

## Free-edit files
- `printpetz-frontend/src/components/pages/Create/index.tsx`
- `printpetz-frontend/src/components/pages/Create/components/StyleSelector/index.tsx` (or a new sibling component if that's cleaner — see Approach)
- New component file(s) for the custom section, e.g. `printpetz-frontend/src/components/pages/Create/components/CustomThemeForm/index.tsx`
- `printpetz-frontend/src/store/api/generationApi.ts` (add `generateCustomImage` mutation)
- `printpetz-frontend/src/store/api/fileApi.ts` (only if the existing `useUploadFileMutation` needs a type-signature tweak — it likely doesn't)
- `printpetz-backend/src/types/aws.ts` (add the one `CUSTOM_REFERENCE` enum value only)
- Everything else, including any SQL, any file outside these two repos, or any git push/merge, still asks.

## Out of scope
- Any change to the trademark check itself, its prompt, its model, or its timeout.
- A feature flag, gradual rollout, or per-user gating — Jake wants this live to everyone as soon as it ships.
- Editing/regenerating a custom generation differently from a normal one in Gallery or the preview dialog — it should already work identically since it lands in the same `generations` table via the same downstream flow.
- Any redesign of the existing theme grid, search, or `StyleContent` component beyond adding the new section below them.
- Rate-limiting or extra abuse protection on top of the existing "one batch in flight" and credit checks — those are backend and already in place.
- Deleting the stale `.git/index.lock` file — flagged above, not part of this build.

## Approach (suggested, not mandatory)
1. Add `CUSTOM_REFERENCE = "custom-reference/[USER_ID]"` to `EUploadPath` in the backend (`src/types/aws.ts`). No controller change needed — `uploadFile` already reads the type generically.
2. Add `generateCustomImage` mutation to `generationApi.ts`, typed against a new `GenerateCustomImageRequest`/reusing `GenerateImageResponse` in `src/types/generation.ts`.
3. Build a new `CustomThemeForm` component: textarea with a live character counter (3-300), an optional photo dropzone/upload button reusing whatever `useUploadFileMutation` pattern `ModelTrainingForm` already uses, and its own local state for `description` / `uploadedPhotoUrl` / `isUploading`.
4. In `Create/index.tsx`, track a new bit of state distinguishing "browsing a theme" vs. "writing a custom description" — e.g. `customDescription: string | null` alongside `selectedStyle`. Render `CustomThemeForm` below `<StyleSelector>` inside `#studio-theme`; when its description is non-empty, treat that as the active choice for Step 03 (clear `selectedStyle` when a custom description starts, and vice versa clear the custom description if a theme tile is clicked — only one can be "selected" at a time).
5. Update the Step 03 review panel and `isGenerateButtonDisabled` to accept either `selectedStyle` or a valid (3-300 char) `customDescription`.
6. Update `handleGenerate` to branch: if a custom description is active, call `generateCustomImage` with `{ description, referencePhotoUrl, modelId, numberOfImages, cutenessLevel: DEFAULT_LOOK_LEVEL }`; otherwise the existing `generateImage` call, unchanged.
7. Handle the `TRADEMARK_BLOCKED` error path distinctly from the generic error toast: show `apiError.data.message` inline near the textarea (not just a toast), keep the typed description so the user can edit it, and don't clear the form.
8. Loading state: while the mutation is in flight, the Generate button already shows `loading={isSubmitting}` — just make sure its label/copy makes sense for the custom path too (e.g. still "Checking..." or similar while `isSubmitting` is true, since the trademark check happens server-side before the response comes back).

## House rules
- STOP at forks only (unexpected number, broken done-when, API spend, anything irreversible). Always STOP before any commit, push, or delete.
- Ask before touching credentials, .env files, secrets, or any production database.
- Prefer the simplest thing that passes every "Done when" check. Eliminate redundancy; do not add features not listed above.
- If a "Done when" check turns out to be impossible or wrong, stop and say so rather than working around it.
- Finish by running through the "Done when" list and reporting pass/fail on each.

## Kick-off prompt
Read specs/custom-theme-ui.md and execute it. Follow the House rules exactly. Branch off main first (delete the stale .git/index.lock in printpetz-frontend if it blocks the checkout). Do not merge, do not run SQL against production, do not delete files.
