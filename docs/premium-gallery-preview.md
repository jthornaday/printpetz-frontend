# Premium Gallery preview

Branch: preview/premium-gallery. Based on main at 18ef88076ad91e50ecbe974bd03be0b1a2b6e5d6, preserving the newer single-column generator, duplicate-generation protection, polling, and redirect to Gallery.

## Amplify test deployment
Connect this branch in the existing Amplify app. Retain the existing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY, NEXT_PUBLIC_SERVER_BASE_URL settings. They point to existing services: a separate frontend branch does not isolate data, generation charges, or credits.
Add the exact preview-origin /login URL to Supabase Authentication > URL Configuration > Redirect URLs so social sign-in returns to the preview. The app uses the current origin and /login for all OAuth providers. Do not place provider secrets in NEXT_PUBLIC variables.

## Facebook and Apple
The shared login/sign-up component implements Google, Facebook, and Apple with a request guard, visible loading state, and initiation/cancellation errors. Google remains available. The new providers are hidden until their build flags are enabled; flags do not configure Supabase.

Facebook: configure the Meta application and Facebook Login, using the Supabase project callback URL shown in its provider settings. Put the App ID and secret into Supabase's Facebook provider and enable it. Check permitted testers during development and Meta's requirements for public access. Then set NEXT_PUBLIC_ENABLE_FACEBOOK_LOGIN=true in Amplify and rebuild.
Official setup: https://supabase.com/docs/guides/auth/social-login/auth-facebook

Apple: configure Sign in with Apple in the Apple Developer account, a Services ID for the web flow, and its domains/return URL matching the Supabase callback. Configure Apple's client ID and generated secret in Supabase, then set NEXT_PUBLIC_ENABLE_APPLE_LOGIN=true and rebuild. Apple web OAuth secrets require rotation at least every six months (or earlier if issued with a shorter expiry). The OAuth flow does not supply a full name; verify the existing users/profile creation trigger works with a missing name and Apple's private-relay email.
Official setup: https://supabase.com/docs/guides/auth/social-login/auth-apple

## Generator redesign
Premium Gallery typography and colors, a desktop split workspace with pet/theme setup on the left and a sticky creation summary on the right, a stacked mobile flow, keyboard-accessible theme buttons, all-category search, empty/error/retry states, clear costs and credit balance, and generation progress guidance. Model selection, uploads, theme IDs, credit costs, and request parameters still use the real existing data flows. No sample models are injected into the authenticated studio.

## Failed-generation credits
The backend main branch now queues OpenAI work off the request thread, charges only for saved synchronous generations, and automatically returns the per-image credit when queued work fails or is swept as abandoned. This frontend keeps polling failed rows so the customer sees the failure in Gallery and refreshes the account when a generation settles, making returned credits visible without a page reload. The backend revision containing that worker/refund path must be deployed before final production approval; a frontend-only deployment cannot activate refunds.

## Test checklist
- Sign in with existing Google/email accounts; confirm the users row and credits load.
- New pet: at least three photos; separate pet name and model name; upload and training status.
- Themes: categories, cross-category search, keyboard selection, no-match and load-failure states.
- Review: pet/theme images, 1–4 images at 2 credits each, insufficient-credit dialog.
- Generate: one request despite double-clicking; Gallery redirect and completion status; correct credit deduction.
- Completed artwork: edit, download, image identity, and email notifications.
- OAuth after provider setup: existing/new accounts, cancellation, denied consent, return to preview origin, Apple Hide My Email, profile creation, sign-out and sign-in again.

Build and lint can run with placeholder connection settings for local validation, but those checks do not validate live provider configuration, authentication, FAL generation, payment, or email delivery. These need the connected preview and an authorized signed-in test account. No production merge or backend change is included.
