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
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "1024x1024",
        type: "image/png",
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
        src: "/screenshots/desktop.png",
        sizes: "1024x1024",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  };
}
