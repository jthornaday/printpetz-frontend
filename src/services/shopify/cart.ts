/**
 * Create a Shopify cart for one generated image and hand back a checkout URL.
 *
 * The four attributes below are the entire contract with the backend. Shopify turns
 * cart line `attributes` into order line item properties, which
 * printpetz-backend/src/controllers/shopify_webhook_controller.ts reads to decide
 * which image to print and on what.
 *
 * The leading underscore keeps them out of the customer-facing cart display while
 * leaving them visible in admin and in the webhook payload.
 *
 * Renaming any of these silently breaks fulfilment. Change both repos or neither.
 */
import { Treatment } from "@/constants/merch_products";

import { storefrontFetch } from "./client";

const CART_CREATE = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl lines(first: 5) { nodes { quantity } } }
      userErrors { field message }
      warnings { code message }
    }
  }
`;

type CartCreateResponse = {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
      lines: { nodes: Array<{ quantity: number }> };
    } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
    warnings: Array<{ code: string; message: string }>;
  };
};

// Shown to the customer when Shopify accepts the cart but drops the item. The real
// reason goes to the console; the customer gets something they can act on.
const UNAVAILABLE_MESSAGE =
  "This product can't be ordered right now. Please try a different one, or check back soon.";

export type OrderLine = {
  variantGid: string;
  quantity: number;
  generationUrl: string;
  generationId: number | string;
  productKey: string;
  treatment: Treatment;
};

export const createCheckoutForGeneration = async (line: OrderLine): Promise<string> => {
  if (!line.generationUrl) throw new Error("This image is not ready to order yet.");
  if (!line.variantGid) throw new Error("This product is not available yet.");

  const data = await storefrontFetch<CartCreateResponse>(CART_CREATE, {
    input: {
      lines: [
        {
          merchandiseId: line.variantGid,
          quantity: line.quantity,
          attributes: [
            { key: "_generation_url", value: line.generationUrl },
            { key: "_generation_id", value: String(line.generationId) },
            { key: "_product_key", value: line.productKey },
            { key: "_treatment", value: line.treatment },
          ],
        },
      ],
    },
  });

  const { cart, userErrors, warnings } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  if (!cart?.checkoutUrl) throw new Error("Shopify did not return a checkout URL.");

  // Shopify does NOT fail cartCreate when it can't sell an item. It returns a valid
  // checkoutUrl for a cart whose line has quantity 0, plus a warning such as
  // MERCHANDISE_OUT_OF_STOCK. Redirecting there drops the customer on an empty
  // checkout with no explanation. This happened for real on 2026-09-25 when the
  // Printful location fell out of the shipping profile: every product was in stock
  // but undeliverable, and every cart came back empty.
  const placed = cart.lines.nodes.reduce((n, l) => n + l.quantity, 0);
  if (placed < line.quantity || warnings?.length) {
    console.error("[shopify-cart] item not added", {
      productKey: line.productKey,
      requested: line.quantity,
      placed,
      warnings,
    });
    throw new Error(UNAVAILABLE_MESSAGE);
  }

  return cart.checkoutUrl;
};
