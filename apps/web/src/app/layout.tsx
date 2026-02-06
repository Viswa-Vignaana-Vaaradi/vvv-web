import type { Metadata } from "next";

import { Geist, Geist_Mono, Poppins } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

import type { AuthInitialSessionData, User, Session } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Viswa Vignaana Vaaradi",
  description: "viswa-vignaana-vaaradi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await authClient.getSession({
    fetchOptions: {
      credentials: "include",
      headers: await headers(),
      throw: false,
    },
  });

  const initialSessionData: AuthInitialSessionData | null =
    session.data?.user && session.data?.session ? {
      user: session.data.user as User,
      session: session.data as Session,
    }
    : null;

  return (
    <html lang="en" suppressHydrationWarning className="bg-primary">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-primary`}
      >
        <Providers initialSession={initialSessionData}>
          <div className="grid grid-rows-[auto_1fr] h-screen">
            <Header />
            <main className="overflow-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
