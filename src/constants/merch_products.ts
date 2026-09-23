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
 * `retailUsd` mirrors the Shopify price for display only. Shopify is the source of
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
  variants: MerchVariant[];
};

export const MERCH_PRODUCTS: MerchProduct[] = [
  {
    key: "poster_8x10", label: '8×10" Print', blurb: "Museum-matte paper.",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526390026498", retailUsd: 31.50, costUsd: 7.03 }],
  },
  {
    key: "framed_8x10", label: '8×10" Framed Print', blurb: "Black frame, ready to hang.",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526391402754", retailUsd: 27.00, costUsd: 20.76 }],
  },
  {
    key: "canvas_16x20", label: '16×20" Canvas', blurb: "Gallery wrap, no frame needed.",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526379507970", retailUsd: 80.00, costUsd: 28.56 }],
  },
  {
    key: "mug_11oz", label: "Mug", blurb: "Dishwasher and microwave safe.",
    variants: [
      { label: "11 oz", variantGid: "gid://shopify/ProductVariant/50526265999618", retailUsd: 8.00, costUsd: 6.07 },
      { label: "15 oz", variantGid: "gid://shopify/ProductVariant/50526266032386", retailUsd: 11.00, costUsd: 8.11 },
      { label: "20 oz", variantGid: "gid://shopify/ProductVariant/50526266065154", retailUsd: 13.00, costUsd: 9.69 },
    ],
  },
  {
    key: "pint_glass_16oz", label: "Pint Glass", blurb: "16oz shaker pint.",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526392549634", retailUsd: 20.00, costUsd: 15.26 }],
  },
  {
    key: "coaster_4x4", label: "Coaster", blurb: "Cork-backed, 3.74in square.",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526403592450", retailUsd: 7.50, costUsd: 5.55 }],
  },
  {
    key: "can_cooler", label: "Can Cooler", blurb: "Keeps a 12oz can cold.",
    variants: [
      { label: "Regular 12 oz", variantGid: "gid://shopify/ProductVariant/50526510252290", retailUsd: 5.00, costUsd: 3.49 },
      { label: "Slim 12 oz", variantGid: "gid://shopify/ProductVariant/50526510285058", retailUsd: 5.00, costUsd: 3.49 },
    ],
  },
  {
    key: "pillow_18x18", label: '18×18" Pillow', blurb: "All-over print, insert included.",
    variants: [{ label: "Default", variantGid: "gid://shopify/ProductVariant/50526365614338", retailUsd: 24.50, costUsd: 16.60 }],
  },
];

export const orderableProducts = () =>
  MERCH_PRODUCTS.filter((p) => p.variants.some((v) => v.variantGid));

export const merchProductByKey = (key: string) =>
  MERCH_PRODUCTS.find((p) => p.key === key) ?? null;

export const TREATMENTS: Array<{ value: Treatment; label: string; blurb: string }> = [
  { value: "panel", label: "Full scene", blurb: "The whole artwork, background and all." },
  { value: "cutout", label: "Cut out", blurb: "Just your pet, no background." },
];

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
