"use client";

import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";
import type { AuthInitialSessionData } from "@/types";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function Providers({ children, initialSession }: { children: React.ReactNode, initialSession: AuthInitialSessionData | null }) {
  const queryClient = new QueryClient();
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialSession={initialSession}>
          {children}
        <Toaster richColors />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
