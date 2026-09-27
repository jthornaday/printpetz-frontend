import type { Treatment } from "@/constants/merch_products";

/** One product preview: a small copy of exactly what prints (same crop as the print file). */
export type PreviewImage = {
  url: string;
  width: number;
  height: number;
  /** Share of the artwork trimmed away to fit the product's shape, 0-1. */
  trimmed: number;
  /** Photoreal version on the product photo, when this product's mockup has passed calibration. */
  mockup?: { url: string; width: number; height: number };
};

export type PreviewEntry = Partial<PreviewImage> & {
  productKey: string;
  treatment: Treatment;
  status: "ready" | "pending" | "failed";
  trimmed: number;
};

export type PreviewManifest = {
  generationId: number;
  sourceUrl: string;
  srcSha: string;
  version: string;
  entries: PreviewEntry[];
  /** False while previews or mockups are still being made. */
  complete?: boolean;
};
