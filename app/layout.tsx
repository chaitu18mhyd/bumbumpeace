import type { Metadata, Viewport } from "next";
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
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
