# printpetz-frontend

Next.js 15 app for PrintPetz. Read `../CLAUDE.md` first for product rules (identity
standard, regression pets, hard gates). This file is the frontend map.

## Stack

- Next.js 15.5 (pages router — `src/pages/`), React 19, Turbopack in dev
- TypeScript, Tailwind CSS v4, shadcn/ui + Radix primitives (`src/components/ui/`)
- Redux Toolkit + redux-persist (`src/store/`), RTK Query-style API layer (`src/store/api/`)
- react-hook-form + yup/zod resolvers for forms (`src/lib/validations/`)
- Supabase client for auth (`src/services/supabase/`)
- react-hot-toast for notifications
- Deploy: **push to `main` auto-deploys to printpetz.com via AWS Amplify.**
  GitHub webhook, no PR checks run first.

## Commands

```
npm run dev      # next dev --turbopack
npm run build
npm run start
npm run lint
```

## Layout

```
src/pages/                      # routes
src/components/pages/           # page-level composition
  Landing/  Create/  Shop/  Plan/  History/  shared/
src/components/ui/              # shadcn primitives + form wrappers
src/components/layout/          # shell, nav
src/components/shared/          # SocialSignIn, Premium, etc.
src/hooks/                      # user/ model/ generation/
src/services/                   # api clients, supabase
src/store/                      # slices + api
src/utils/images/               # static image sets (sports, mockups, sliders, landing)
src/lib/validations/            # form schemas
specs/                          # per-feature specs — read before changing that feature
docs/
```

## UI direction

- Brand: royal blue / black / white. Masculine, inviting, family-friendly — not cutesy.
- Cleaner over busier. Jake consistently picks the simpler option.
- Merchandise-forward, not "AI tool"-forward.
- **No auto-playing/animated hero imagery** — asked for and removed before.
- Studio layout: create/setup controls left, results right.

## Flows that have broken before — regression-test these

- **Signup → model creation page**: page has gotten stuck after account creation.
- **Training photo upload**: the upload control has vanished entirely, and on mobile
  there was no visible place to upload at all.
- **Minimum 3 photos**, not 15. Continue must enable at 3. More photos = optional,
  framed as "more angles can improve your results."
- **Model name vs pet/display name** — both fields must exist and both must submit.
- **Download** must download the file directly, not open a new tab.
- **Delete** requires a confirmation step.
- **Post-purchase**: after Stripe success, show a clear "You're all set" confirmation
  and return the user to the creation flow — **never back to the plans page.**
- **Processing states** must be legible: uploading → preparing → training → almost
  ready → ready → generating → complete → failed (with retry). Never a silent spinner.
- **Model picker** should show reference images, not a bare dropdown, with an obvious
  "Create My Model" CTA when expanded.

## Mobile

Jake uses **iPhone Safari** primarily. Known past failures: no visible upload control,
and the page compressing horizontally. Desktop Chrome looking right is not evidence
the layout is fixed. Test iPhone Safari and desktop Safari viewports.

## Merch mockups

Artwork must sit centered in safe print zones — sufficient margin, no cropped ears or
paws, nothing critical at the edges. Mockup positioning is its own logic, separate from
image generation. Max has rendered off-center in product mockups before.

## Gates

Don't commit, push, or merge. Build, verify, write up what changed, then hand Jake the
exact commands. Merging to `main` is a production deploy.
