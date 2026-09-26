import type { PreviewImage } from "@/types/merch";

/**
 * Sample previews shown to visitors who are signed out or have no artwork yet, so
 * the logged-out shop makes zero backend calls. Rendered by the backend's
 * `npm run merch-demo` from Max (the brand mascot). Full scene only.
 *
 * PLACEHOLDER IMAGE: Max's regression photo, until Jake picks the showcase images.
 * Regenerate with: npm run merch-demo -- <image> (printpetz-backend), then paste.
 */
export const DEMO_PET_NAME = "Max";

export const DEMO_PREVIEWS: Record<string, PreviewImage> = {
  poster_8x10: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v1/poster_8x10-panel.jpg", width: 640, height: 800, trimmed: 0.02 },
  framed_8x10: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v1/framed_8x10-panel.jpg", width: 640, height: 800, trimmed: 0.02 },
  canvas_16x20: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v1/canvas_16x20-panel.jpg", width: 640, height: 800, trimmed: 0.02 },
  mug_11oz: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v1/mug_11oz-panel.jpg", width: 640, height: 800, trimmed: 0.02 },
  coaster_4x4: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v1/coaster_4x4-panel.jpg", width: 800, height: 800, trimmed: 0.19 },
  can_cooler: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v1/can_cooler-panel.jpg", width: 660, height: 800, trimmed: 0.01 },
  pillow_18x18: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v1/pillow_18x18-panel.jpg", width: 800, height: 800, trimmed: 0.19 },
};
