"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA_MEASUREMENT_ID = "G-DEG44LQS54";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    if (!window.gtag) return;
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;
    window.gtag("config", GA_MEASUREMENT_ID, { page_path: pagePath });
  }, [pathname, queryString]);

  return null;
}
