// import { object, string } from "yup";

// import validateEnv from "./env.utils.mjs";

// export const envConfigSchema = object({
//   NEXT_PUBLIC_ENV_TYPE: string().oneOf(["TEST", "DEV", "ALPHA", "PRODUCTION"]).default("DEV"),
//   NEXT_PUBLIC_SUPABASE_URL: string().required(),
//   NEXT_PUBLIC_SUPABASE_KEY: string().required(),
//   NEXT_PUBLIC_SERVER_BASE_URL: string().required(),
//   // NEXT_PUBLIC_API_KEY: string().required(),
// });

// const envConfig = await validateEnv(envConfigSchema);

// next.config.mjs
const config = {
  reactStrictMode: true,
  // ... other config options
  transpilePackages: [
    "redux-persist",
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};



export default config;
