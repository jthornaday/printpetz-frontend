# M2a — Order flow: from a generated image to Shopify checkout

## Goal
A customer looking at artwork of their pet can buy it on a product, and the order
that reaches Printful carries **that image**.

## Done when
- [ ] A completed generation in History shows an **Order print** control. Pending,
      generating and errored generations do not.
- [ ] Choosing a product and a treatment (panel / cutout) and confirming sends the
      customer to Shopify checkout with that item in the cart.
- [ ] The resulting Shopify order's line item carries all four properties M3 reads:
      `_generation_url`, `_generation_id`, `_product_key`, `_treatment`.
      **Verify by looking at a real order in Shopify admin**, not by reading code.
- [ ] A generation with no image, or a product with no configured variant, cannot be
      ordered — the control is disabled or absent, never a broken checkout.
- [ ] `npm run build` is clean and the existing History and Create flows still work.
      Both have regressed before; see this repo's CLAUDE.md.

## Why this shape
Jake's answer when asked how big v1 should be: a single "Order a print" button on an
image the customer already generated, rather than a browsable storefront. This spec is
that. Catalog browsing, a cart page holding several items, and in-app order history
are **M2b** and are not in scope here.

The `/shop` page today is a preview that says "Physical product ordering is not yet
available". Making that sentence false is the point of this milestone.

## How the pieces connect — already proven
M3 is built and tested (`printpetz-backend/specs/merch-m3-fulfillment.md`). It reads
line item properties off a paid Shopify order, builds the print file, and creates the
Printful order. It has been verified end to end through the live endpoint.

**This milestone's only job on the data side is putting those four properties on the
line item.** Shopify cart line `attributes` become order line item properties, which
is the mechanism. Get the names exactly right or M3 rejects the order:

| attribute | value | source |
|---|---|---|
| `_generation_url` | the finished image URL | `IGeneration.image` |
| `_generation_id` | the generation id | `IGeneration.id` |
| `_product_key` | `poster_8x10`, `mug_11oz`, ... | product picker |
| `_treatment` | `panel` or `cutout` | product picker |

The leading underscore is deliberate: Shopify hides underscore-prefixed properties
from the customer-facing cart and order display, while keeping them visible in admin
and in the webhook payload. A customer should not see a CloudFront URL.

## Prerequisites — Jake, before this can be built
1. **The seven products must exist in Shopify.** Create them through the Printful app
   (Printful → Product catalog → add to store). One product per SKU. Name them
   generically — "Custom Pet Mug 11oz" — NOT after a test pet.
2. **A Storefront API access token.** Shopify admin → Settings → Apps and sales
   channels → Develop apps → create an app → Storefront API access token. Needs
   `unauthenticated_write_checkouts` and `unauthenticated_read_product_listings`.
3. **The variant GIDs** for each product, as `gid://shopify/ProductVariant/<id>`.
   Paste them and they go in the product map.
4. **Retail prices set in Shopify.** Printful's cost plus shipping, measured
   2026-09-23: poster $7.03 + $4.99 ship; mug $6.07 + $6.69 ship; canvas $28.56;
   framed 8x10 $20.76; coaster $5.55; koozie $3.49; pillow $16.60. Margin is Jake's
   call, not this spec's.

Without 1-3 this milestone cannot be finished. Build what can be built, then stop and
say which of them is missing.

## Constraints
- **Storefront API only.** No Admin API from the browser, ever — an Admin token in
  frontend code is a total store compromise. The Storefront token is public by design.
- Env vars, both public: `NEXT_PUBLIC_SHOPIFY_DOMAIN`,
  `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`. No secrets in this repo.
- Checkout **redirects to Shopify** and that is expected. The store is on the Basic
  plan; on-domain checkout needs Plus at $2,300/mo, which was considered and rejected
  (see `printpetz-backend/specs/merch-parent.md`). Do not try to build around the
  redirect.
- Do not change the generation, upload or credits flows.
- Treatment names must be exactly `panel` and `cutout`. Product keys must match
  `printpetz-backend/src/constants/print_products.ts` exactly.

## Free-edit files
- `src/services/shopify/` (new — storefront client and cart mutation)
- `src/constants/merch_products.ts` (new — product key -> variant GID, label, price)
- `src/components/pages/History/components/OrderPrintButton.tsx` (new)
- `src/components/pages/History/components/OrderPrintDialog.tsx` (new)
- `src/components/pages/History/index.tsx` (to mount the control)
- `specs/merch-m2a-order-flow.md` (this file)

Anything else asks first — particularly `src/pages/shop.tsx` and the Create flow.

## Out of scope
- Browsable catalog, multi-item cart page, in-app order history. That is M2b.
- Showing Printful mockups of the customer's pet on the product. Nice, and a separate
  job — Printful's mockup generator is a different API.
- Refunding credits when merch is bought. That is M4.
- Changing `/shop` from a preview into a real storefront. M2b.
- Discounts, gift cards, taxes, shipping estimates. Shopify owns all of that.

## Approach (suggested, not mandatory)
- Keep the Storefront call to one `cartCreate` GraphQL mutation returning
  `checkoutUrl`, then `window.location.assign(checkoutUrl)`. No cart state to manage,
  because there is no cart page in this milestone.
- `merch_products.ts` mirrors the backend's seven keys. A mismatch between the two
  files is the most likely way this breaks silently, so the keys are worth a comment
  in both directions.
- The dialog is small: product select, treatment radio, price, Buy. Radix `Dialog`,
  `Select` and `RadioGroup` are already dependencies.
- Biggest risk is a **silent property-name mismatch** — checkout succeeds, the order
  arrives, and M3 rejects it or, worse, the wrong thing prints. Before calling this
  done, place one real order and read the line item properties in Shopify admin.
  A passing build proves nothing here.

## House rules
- STOP at forks only (unexpected number, broken done-when, API spend, anything
  irreversible). Always STOP before any commit, push, or delete.
- Ask before touching credentials, .env files, secrets, or any production database.
- Prefer the simplest thing that passes every "Done when" check. Eliminate redundancy;
  do not add features not listed above.
- If a "Done when" check turns out to be impossible or wrong, stop and say so rather
  than working around it.
- Finish by running through the "Done when" list and reporting pass/fail on each.

## Kick-off prompt
Read specs/merch-m2a-order-flow.md and execute it. Follow the House rules exactly.
The four line item attribute names must match printpetz-backend/src/constants and the
M3 controller exactly — a mismatch means the wrong pet gets printed.
