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
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

type CartCreateResponse = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
};

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

  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  if (!cart?.checkoutUrl) throw new Error("Shopify did not return a checkout URL.");
  return cart.checkoutUrl;
};
