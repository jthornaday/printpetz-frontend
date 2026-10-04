import type { Treatment } from "@/constants/merch_products";

/** Products that print the pet's name (pet bowl): the name as printed, or why none prints. */
export type Personalization = {
  lines: string[] | null;
  /** false: the name was too long to sit beside the portrait, so it prints alone on the front. */
  frontPortrait?: boolean;
  omitted?: "no_name" | "unsupported_characters" | "too_long";
};

/** One product preview: a small copy of exactly what prints (same crop as the print file). */
export type PreviewImage = {
  url: string;
  width: number;
  height: number;
  /** Share of the artwork trimmed away to fit the product's shape, 0-1. */
  trimmed: number;
  /** Photoreal version on the product photo, when this product's mockup has passed calibration. */
  mockup?: { url: string; width: number; height: number };
  personalization?: Personalization;
};

export type PreviewEntry = Partial<PreviewImage> & {
  productKey: string;
  treatment: Treatment;
  status: "ready" | "pending" | "failed";
  trimmed: number;
  /** The photoreal mockup is still rendering; wait for it rather than showing the flat art first. */
  mockupPending?: boolean;
};

export type PreviewManifest = {
  generationId: number;
  sourceUrl: string;
  srcSha: string;
  version: string;
  entries: PreviewEntry[];
  /** False while previews or mockups are still being made. */
  complete?: boolean;
  /** Made with free starter credits: previews carry the watermark; the product prints without it. */
  watermarked?: boolean;
};
