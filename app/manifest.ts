import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hodlr",
    short_name: "Hodlr",
    description: "Personal Investment Portfolio Management",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/mobile.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/mobile-2.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/mobile-3.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "narrow",
      },
      {
        src: "/screenshots/desktop.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshots/desktop-2.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshots/desktop-3.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
