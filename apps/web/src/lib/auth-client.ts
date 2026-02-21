import { env } from "@repo/env/web";
import { createAuthClient } from "better-auth/react";
import { customSessionClient, emailOTPClient, lastLoginMethodClient, usernameClient, adminClient } from "better-auth/client/plugins";
import type { auth } from "@repo/auth";

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
    emailOTPClient(),
    customSessionClient<typeof auth>(),
    adminClient()
  ]
});
