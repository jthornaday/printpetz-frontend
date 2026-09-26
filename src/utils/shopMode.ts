/**
 * NEXT_PUBLIC_SHOP_MODE (baked in at build time on Amplify):
 *   off     - the old placeholder /shop, no nav link (default)
 *   preview - the new shop only in a browser that has visited /shop?shop_preview=1
 *   on      - the new shop for everyone, with nav links
 */
const MODE = process.env.NEXT_PUBLIC_SHOP_MODE ?? "off";
const PREVIEW_KEY = "pp_shop_preview";

const previewOptedIn = () => {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("shop_preview") === "1") {
      window.localStorage.setItem(PREVIEW_KEY, "1");
      return true;
    }
    return window.localStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
};

/** Call on the client only (after mount), since preview mode depends on localStorage. */
export const shopEnabled = () => MODE === "on" || (MODE === "preview" && previewOptedIn());
