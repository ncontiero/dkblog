import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // Node
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // Database (Prisma)
    DATABASE_URL_NON_POOLING: z.string().url(),
    DATABASE_URL: z.string().url(),

    // these variables are used for the site's SEO
    SITE_NAME: z.string().default("DkBlog"),
    SITE_LOCALE: z.string().default("en_US"),
    // URLs
    SITE_BASEURL: z.string().url().default("http://localhost:3000"),

    // Google Storage (Only PROD)
    GS_BUCKET_NAME: z.string().min(1),
    GS_PROJECT_ID: z.string().min(1),
    GS_CLIENT_EMAIL: z.string().email(),
    GS_PRIVATE_KEY: z.string().min(1),
  },
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_IMG_DOMAINS: z.string().transform((val) => val.split(",")),
    // API
    NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000/api"),
  },
  runtimeEnv: {
    // Node
    NODE_ENV: process.env.NODE_ENV,
    // Database (Prisma)
    DATABASE_URL_NON_POOLING: process.env.DATABASE_URL_NON_POOLING,
    DATABASE_URL: process.env.DATABASE_URL,
    // SEO
    SITE_NAME: process.env.SITE_NAME,
    SITE_LOCALE: process.env.SITE_LOCALE,
    SITE_BASEURL: process.env.SITE_BASEURL,
    // Google Storage (Only PROD)
    GS_BUCKET_NAME: process.env.GS_BUCKET_NAME,
    GS_PROJECT_ID: process.env.GS_PROJECT_ID,
    GS_CLIENT_EMAIL: process.env.GS_CLIENT_EMAIL,
    GS_PRIVATE_KEY: process.env.GS_PRIVATE_KEY,

    // Client
    // ----------------------------
    NEXT_PUBLIC_IMG_DOMAINS: process.env.NEXT_PUBLIC_IMG_DOMAINS,
    // API
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
