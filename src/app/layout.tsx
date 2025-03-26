import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React from "react";
import "./globals.css";
import { siteConfig } from "./siteConfig";
import { AuthProvider } from "@/components/AuthProvider";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const metadata: Metadata = {
  metadataBase: new URL("https://yoururl.com"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [],
  authors: [
    {
      name: "yourname",
      url: "",
    },
  ],
  creator: "yourname",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const initialIsLoggedIn = !!session;
  const initialUserEmail = session?.user?.email || "Unknown";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} overflow-x-hidden overflow-y-scroll scroll-auto bg-gray-50 antialiased selection:bg-blue-100 selection:text-blue-700 dark:bg-gray-950`}
      >
        <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          attribute="class"
        >
          <NuqsAdapter>
            <AuthProvider initialIsLoggedIn={initialIsLoggedIn} initialUserEmail={initialUserEmail}>
              <div className="mx-auto w-full">
                {children}
              </div>
            </AuthProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}