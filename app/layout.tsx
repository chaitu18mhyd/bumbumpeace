import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "flag-icons/css/flag-icons.min.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAnalyticsPageViews from "@/components/GoogleAnalyticsPageViews";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "RETOPIAN - Retire in Utopian cities",
  description:
    "Compare estimated monthly retirement expenses across popular cities and countries. Estimates only, not financial advice.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f7ff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xa63mp2ccc");`}
        </Script>
      </head>
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
