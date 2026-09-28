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
  poster_8x10: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/poster_8x10-panel.jpg", width: 640, height: 800, trimmed: 0.02,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/poster_8x10-panel-mockup-1d75343bb64b.webp", width: 1000, height: 1000 } },
  framed_8x10: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/framed_8x10-panel.jpg", width: 640, height: 800, trimmed: 0.02,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/framed_8x10-panel-mockup-c6d6dd8a5a9f.webp", width: 1000, height: 1000 } },
  canvas_16x20: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/canvas_16x20-panel.jpg", width: 640, height: 800, trimmed: 0.02,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/canvas_16x20-panel-mockup-138bae52e3c9.webp", width: 1000, height: 1000 } },
  mug_11oz: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/mug_11oz-panel.jpg", width: 640, height: 800, trimmed: 0.02,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/mug_11oz-panel-mockup-7da92c398d8b.webp", width: 1000, height: 1000 } },
  coaster_4x4: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/coaster_4x4-panel.jpg", width: 800, height: 800, trimmed: 0.19,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/coaster_4x4-panel-mockup-0334b5085ff4.webp", width: 1000, height: 1000 } },
  can_cooler: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/can_cooler-panel.jpg", width: 660, height: 800, trimmed: 0.02,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/can_cooler-panel-mockup-bb14c313fdc7.webp", width: 1000, height: 1000 } },
  pillow_18x18: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/pillow_18x18-panel.jpg", width: 800, height: 800, trimmed: 0.02,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/pillow_18x18-panel-mockup-7114509cfe00.webp", width: 1000, height: 1000 } },
  ornament_ceramic_circle: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/ornament_ceramic_circle-panel.jpg", width: 800, height: 800, trimmed: 0.02 },
  ornament_metal_oval: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/ornament_metal_oval-panel.jpg", width: 525, height: 650, trimmed: 0.02,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/ornament_metal_oval-panel-mockup-de127874aa2f.webp", width: 1000, height: 1000 } },
  card_4x6: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/card_4x6-panel.jpg", width: 539, height: 800, trimmed: 0.17,
    mockup: { url: "https://d155jdfit5sgy.cloudfront.net/merch/previews/611d2a6c8c38252013797cab1abd32a1/v2/card_4x6-panel-mockup-e590549584b3.webp", width: 1000, height: 1000 } },
};
