import { env } from "@repo/env/web";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient, lastLoginMethodClient, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [
    usernameClient(),
    lastLoginMethodClient(),
    emailOTPClient()
  ]
});
