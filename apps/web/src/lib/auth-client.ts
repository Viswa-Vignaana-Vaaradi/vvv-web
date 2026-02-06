import { env } from "@repo/env/web";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient, lastLoginMethodClient, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  fetchOptions: {
    credentials: "include",
    onError: async (ctx) => {
      if (ctx.response.status === 429) {
        const retryAfter = ctx.response.headers.get("X-Retry-After");
        console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }
    }
  },
  plugins: [
    usernameClient(),
    lastLoginMethodClient(),
    emailOTPClient()
  ]
});
