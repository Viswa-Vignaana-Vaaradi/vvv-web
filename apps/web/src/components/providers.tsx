"use client";

import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import type { AuthInitialSessionData } from "@/types";

export default function Providers({ children, initialSession }: { children: React.ReactNode, initialSession: AuthInitialSessionData | null }) {
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider initialSession={initialSession}>
        {children}
      <Toaster richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}
