/**
 * Merch catalog, frontend half.
 *
 * `key` MUST match printpetz-backend/src/constants/print_products.ts exactly. The
 * backend builds the print file from this key; a mismatch means the order is
 * rejected, or worse, the wrong thing prints.
 *
 * Variant GIDs pulled from the Shopify Storefront API on 2026-09-23, not typed by
 * hand. To refresh after adding a product, query:
 *   { products(first:30){ edges{ node{ title variants(first:20){ edges{ node{ id title } } } } } } }
 *
 * `retailUsd` mirrors the Shopify price for display only. Synced 2026-09-25. Shopify is the source of
 * truth at checkout — if the two drift, the customer pays Shopify's number.
 */

export type Treatment = "panel" | "cutout";

export type MerchVariant = {
  /** Customer-facing size label. "Default" collapses to no size picker. */
  label: string;
  variantGid: string;
  retailUsd: number;
  /** Printful cost when looked up, for margin sanity. Never shown to customers. */
  costUsd: number;
};

export type MerchProduct = {
  key: string;
  label: string;
  blurb: string;
  /** Scale cue shown on every shop tile, so a coaster never reads as a canvas. */
  sizeNote: string;
  /** Exists in Shopify and in the backend catalog, but not offered yet. */
  hidden?: boolean;
  /** Prints the pet's name, so it's sold only from the showroom, where the preview shows the name. */
  showroomOnly?: boolean;
  variants: MerchVariant[];
};

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    key: "poster_8x10", label: '8×10" Print', blurb: "Museum-matte paper.", sizeNote: "8 × 10 in",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526390026498", retailUsd: 35.00, costUsd: 7.03 }],
  },
  {
    key: "framed_8x10", label: '8×10" Framed Print', blurb: "Black frame, ready to hang.", sizeNote: "8 × 10 in, black frame",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526391402754", retailUsd: 59.00, costUsd: 20.76 }],
  },
  {
    key: "canvas_16x20", label: '16×20" Canvas', blurb: "Gallery wrap, no frame needed.", sizeNote: "16 × 20 in canvas",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526379507970", retailUsd: 89.00, costUsd: 28.56 }],
  },
  {
    key: "mug_11oz", label: "Mug", blurb: "Dishwasher and microwave safe.", sizeNote: "11, 15 or 20 oz",
    variants: [
      { label: "11 oz", variantGid: "gid://shopify/ProductVariant/50526265999618", retailUsd: 25.00, costUsd: 6.07 },
      { label: "15 oz", variantGid: "gid://shopify/ProductVariant/50526266032386", retailUsd: 29.00, costUsd: 8.11 },
      { label: "20 oz", variantGid: "gid://shopify/ProductVariant/50526266065154", retailUsd: 33.00, costUsd: 9.69 },
    ],
  },
  // Hidden from the picker. The pint glass print file is 9.58x5.04in @300 DPI —
  // 1.9:1 landscape against our 0.81 portrait source, so a crop gives a horizontal
  // slice of pet. It needs wrap composition, not a crop. The Shopify product exists
  // and the key matches the backend; set `hidden: false` once that work is done.
  {
    key: "pint_glass_16oz", label: "Pint Glass", blurb: "16oz shaker pint.", sizeNote: "16 oz", hidden: true,
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526392549634", retailUsd: 20.00, costUsd: 15.26 }],
  },
  {
    key: "coaster_4x4", label: "Coaster", blurb: "Cork-backed, 3.74in square.", sizeNote: "3.74 in, drink-sized",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526403592450", retailUsd: 14.00, costUsd: 5.55 }],
  },
  {
    key: "can_cooler", label: "Can Cooler", blurb: "Keeps a 12oz can cold.", sizeNote: "Fits a 12 oz can",
    variants: [
      { label: "Regular 12 oz", variantGid: "gid://shopify/ProductVariant/50526510252290", retailUsd: 12.00, costUsd: 3.49 },
      // Slim (50526510285058) is hidden: Printful's slim print area is tall and narrow
      // (1076x2085) and our file would lose ~40% of its width. Re-add once the backend
      // has a slim print-file spec.
    ],
  },
  {
    key: "pillow_18x18", label: '18×18" Pillow', blurb: "All-over print, insert included.", sizeNote: "18 × 18 in",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526365614338", retailUsd: 49.00, costUsd: 16.60 }],
  },
  // Holiday line, 2026-09-27. Shapes chosen so the whole pet survives: no hearts, stars or
  // snowflakes (their cut edges clip ears and tails). Costs are Printful's, before shipping.
  {
    // The art sits below the hanging hole (backend safeArea) inside the 2.76" disc; checked on 5 pets
    // against Printful's own renders. The pet is ~1.7" tall on the ornament.
    key: "ornament_ceramic_circle", label: "Ceramic Ornament", blurb: "Glossy ceramic, printed on both sides, ribbon included.", sizeNote: "2.76 in circle",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50554248265986", retailUsd: 22.00, costUsd: 7.73 }],
  },
  {
    key: "ornament_metal_oval", label: "Metal Ornament", blurb: "Glossy white aluminum, red ribbon included.", sizeNote: "2.6 × 3.25 in oval",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50554260029698", retailUsd: 18.00, costUsd: 4.61 }],
  },
  {
    // Sold in packs only (one card plus $6.95 shipping doesn't sell). Each pack prints that many
    // cards (backend packQuantity).
    key: "card_4x6", label: "Greeting Cards", blurb: "Heavy 350 gsm cards, blank inside, envelopes included.", sizeNote: "4 × 6 in, packs of 5 or 10",
    variants: [
      { label: "5 cards", variantGid: "gid://shopify/ProductVariant/50556470034690", retailUsd: 24.00, costUsd: 12.75 },
      { label: "10 cards", variantGid: "gid://shopify/ProductVariant/50556470067458", retailUsd: 39.00, costUsd: 25.50 },
    ],
  },
  // Pet bowl, 2026-09-29: design B2 — portrait + the pet's name on the front, portraits round the
  // sides (backend band layout). The name comes from the pet model server-side, never the browser.
  // Hidden until Jake flips it (specs/merch-pet-bowl.md in printpetz-backend).
  {
    key: "pet_bowl", label: "Pet Bowl", blurb: "Stainless steel, printed with your pet’s name and portrait all the way round.", sizeNote: "18 or 32 oz",
    hidden: true, showroomOnly: true,
    variants: [
      { label: "18 oz", variantGid: "gid://shopify/ProductVariant/50558146150658", retailUsd: 42.00, costUsd: 28.25 },
      { label: "32 oz", variantGid: "gid://shopify/ProductVariant/50558146183426", retailUsd: 48.00, costUsd: 32.25 },
    ],
  },
];

export const orderableProducts = () =>
  MERCH_PRODUCTS.filter((p) => !p.hidden && p.variants.some((v) => v.variantGid));

/** For the quick order dialog, which shows the plain image rather than the product preview. */
export const quickOrderProducts = () => orderableProducts().filter((p) => !p.showroomOnly);

export const merchProductByKey = (key: string) =>
  MERCH_PRODUCTS.find((p) => p.key === key) ?? null;

export const TREATMENTS: Array<{ value: Treatment; label: string; blurb: string }> = [
  { value: "panel", label: "Full scene", blurb: "The whole artwork, background and all." },
  { value: "cutout", label: "Cut out", blurb: "Just your pet, no background." },
];

/**
 * What customers can pick today. Cut-out is off for launch: background removal
 * dropped Wizard's tail and paws and George's bat in testing, and a missing tail is
 * an identity failure. Re-add "cutout" once it passes the regression-pet check
 * (specs/merch-m4-shop-showroom-product.md, "Mockup fidelity bar").
 */
export const OFFERED_TREATMENTS = TREATMENTS.filter((t) => t.value === "panel");

/**
 * True only when Shopify is configured AND something is orderable. Until then the
 * Order control is hidden entirely — a button that opens a "not available" dialog is
 * worse than no button.
 */
export const merchAvailable = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN &&
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN &&
      orderableProducts().length > 0,
  );

/**
 * Standard shipping exactly as Shopify charges it at checkout, by order subtotal. Verified
 * 2026-10-02 against the store's live checkout (Storefront cart delivery options): $14 and $25 ->
 * $6.95, $49 and $59 -> $9.95, $89 -> $12.95, $178 -> free. Alaska and Hawaii are the same. Canada,
 * the UK and Australia get no shipping option, so it's US only. If the Shopify shipping profile
 * changes, change this too: the shop must never quote a different number than checkout charges.
 */
const SHIPPING_TIERS = [
  { under: 30, usd: 6.95 },
  { under: 60, usd: 9.95 },
  { under: 100, usd: 12.95 },
];

/** Shipping for an order of this subtotal (0 = free). */
export const shippingFor = (subtotalUsd: number) =>
  SHIPPING_TIERS.find((t) => subtotalUsd < t.under)?.usd ?? 0;

/** Printful's stated production and US transit times (2026-09-26). */
export const TURNAROUND = "Made to order in 2–5 business days, then 3–4 business days to arrive.";
