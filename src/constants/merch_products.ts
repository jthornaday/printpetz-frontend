/**
 * Merch catalog, frontend half.
 *
 * The `key` values MUST match printpetz-backend/src/constants/print_products.ts
 * exactly. The backend builds the print file from this key; a mismatch means the
 * order is rejected, or worse, the wrong thing prints.
 *
 * `variantGid` comes from Shopify once the products exist:
 *   Shopify admin -> Products -> <product> -> variant -> the id in the URL,
 *   as "gid://shopify/ProductVariant/<id>".
 * Products with a null variantGid are not orderable and are hidden from the picker.
 */

export type Treatment = "panel" | "cutout";

export type MerchProduct = {
  /** Must match the backend product key exactly. */
  key: string;
  label: string;
  blurb: string;
  /** Shopify variant GID. null until the product exists in Shopify. */
  variantGid: string | null;
  /** Retail price in USD, for display. Shopify is the source of truth at checkout. */
  retailUsd: number | null;
  /** Printful cost + shipping as measured 2026-09-23. Not shown to customers. */
  costUsd: number;
};

export const MERCH_PRODUCTS: MerchProduct[] = [
  { key: "poster_8x10",  label: '8×10" Print',          blurb: "Museum-matte paper.",           variantGid: null, retailUsd: null, costUsd: 12.02 },
  { key: "framed_8x10",  label: '8×10" Framed Print',   blurb: "Ready to hang.",                variantGid: null, retailUsd: null, costUsd: 20.76 },
  { key: "canvas_16x20", label: '16×20" Canvas',        blurb: "Gallery wrap, no frame needed.", variantGid: null, retailUsd: null, costUsd: 28.56 },
  { key: "mug_11oz",     label: "11oz Mug",             blurb: "Dishwasher and microwave safe.", variantGid: null, retailUsd: null, costUsd: 12.76 },
  { key: "coaster_4x4",  label: "Cork-Back Coaster",    blurb: "Cork backing, 3.74in square.",   variantGid: null, retailUsd: null, costUsd: 5.55 },
  { key: "koozie",       label: "Can Koozie",           blurb: "Fits a regular 12oz can.",       variantGid: null, retailUsd: null, costUsd: 3.49 },
  { key: "pillow_18x18", label: '18×18" Pillow',        blurb: "All-over print, insert included.", variantGid: null, retailUsd: null, costUsd: 16.60 },
];

/** Only products that can actually be bought. */
export const orderableProducts = () => MERCH_PRODUCTS.filter((p) => p.variantGid);

export const merchProductByKey = (key: string) =>
  MERCH_PRODUCTS.find((p) => p.key === key) ?? null;

export const TREATMENTS: Array<{ value: Treatment; label: string; blurb: string }> = [
  { value: "panel",  label: "Full scene",   blurb: "The whole artwork, background and all." },
  { value: "cutout", label: "Cut out",      blurb: "Just your pet, no background." },
];

/**
 * True only when Shopify is configured AND at least one product has a variant id.
 * Until then the Order control is hidden entirely — showing a button that opens a
 * "not available" dialog is worse than showing no button.
 */
export const merchAvailable = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN &&
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN &&
      MERCH_PRODUCTS.some((p) => p.variantGid),
  );
