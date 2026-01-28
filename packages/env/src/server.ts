import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url().optional(),
    CORS_ORIGIN: z.url().optional(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    UPLOADTHING_TOKEN: z.string().min(32),
    UPLOADTHING_APP_ID: z.string().min(5),
    GOOGLE_CLIENT_ID: z.string().min(5),
    GOOGLE_CLIENT_SECRET: z.string().min(5),
    RESEND_API_KEY: z.string().min(5),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
