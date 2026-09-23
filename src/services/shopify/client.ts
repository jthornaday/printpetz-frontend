/**
 * Shopify Storefront API client.
 *
 * Storefront tokens are public by design — they are meant to ship in frontend code.
 * The ADMIN API token is not, and must never appear in this repo.
 */
const API_VERSION = "2025-07";

export const shopifyConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN);

export const storefrontFetch = async <T>(query: string, variables: Record<string, unknown>): Promise<T> => {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!domain || !token) {
    throw new Error(
      "Shopify is not configured. Set NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.",
    );
  }

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json) throw new Error(`Shopify Storefront request failed (${res.status})`);
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? "Shopify returned an error");
  return json.data as T;
};
