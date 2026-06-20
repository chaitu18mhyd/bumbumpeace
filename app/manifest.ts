import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BumBumSafe — Retirement City Explorer",
    short_name: "BumBumSafe",
    description:
      "Compare estimated monthly retirement expenses across popular cities and countries.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f7ff",
    theme_color: "#f2f7ff",
    icons: [
      {
        src: "/logo/bumbumsafe-logo-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo/bumbumsafe-logo-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
