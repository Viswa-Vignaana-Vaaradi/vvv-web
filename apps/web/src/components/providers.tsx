import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export default async function Providers({ children }: { children: React.ReactNode }) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider initialSession={session}>
      {children}
      <Toaster richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
