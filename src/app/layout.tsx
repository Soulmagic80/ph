import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import React from "react";
import { Toaster } from "sonner";
// import "../lib/monitoring"; // REMOVED: Causes DataCloneError - now using MonitoringProvider
import "./globals.css";
import { siteConfig } from "./siteConfig";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["portfolio", "design", "feedback", "community"],
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.author,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased bg-white dark:bg-gray-950" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-gray-950`}>
        <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          attribute="class"
        >
          <ErrorBoundary>
            {children}
            <Toaster position="top-right" />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
