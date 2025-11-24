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
    "@hookform/resolvers",
    "@radix-ui/react-aspect-ratio",
    "@radix-ui/react-dialog",
    "@radix-ui/react-label",
    "@radix-ui/react-popover",
    "@radix-ui/react-radio-group",
    "@radix-ui/react-select",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
    "@radix-ui/react-tabs",
    "@reduxjs/toolkit",
    "@supabase/supabase-js",
    "class-variance-authority",
    "clsx",
    "dayjs",
    "lucide-react",
    "next",
    "react",
    "react-dom",
    "react-hook-form",
    "react-hot-toast",
    "react-redux",
    "redux-persist",
    "tailwind-merge",
    "vaul",
    "yup"
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
