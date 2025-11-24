import { object, string } from "yup";

import validateEnv from "./env.utils.mjs";

export const envConfigSchema = object({
  NEXT_PUBLIC_ENV_TYPE: string().oneOf(["TEST", "DEV", "ALPHA", "PRODUCTION"]).default("DEV"),
  NEXT_PUBLIC_SUPABASE_URL: string().required(),
  NEXT_PUBLIC_SUPABASE_KEY: string().required(),
  NEXT_PUBLIC_SERVER_BASE_URL: string().required(),
  // NEXT_PUBLIC_API_KEY: string().required(),
});

const envConfig = await validateEnv(envConfigSchema);

/**
 * Configuration for `next.config.mjs`
 * @type {import('next').NextConfig}
 * @refer {@link https://nextjs.org/docs/api-reference/next.config.mjs}
 */
const config = {
  reactStrictMode: true,
  env: envConfig,
  images: {
    unoptimized: true, // Disable image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default config;
