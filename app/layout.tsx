import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAnalyticsPageViews from "@/components/GoogleAnalyticsPageViews";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "BumBumSafe — Find Cities Where Your Retirement Money Goes Further",
  description:
    "Compare estimated monthly retirement expenses across popular cities and countries. Prototype estimates only — not financial advice.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf7f0",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <GoogleAnalyticsPageViews />
        </Suspense>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
