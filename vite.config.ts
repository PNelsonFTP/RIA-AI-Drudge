import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages project site: https://pnelsonftp.github.io/RIA-AI-Drudge/
const base = "/RIA-AI-Drudge/";

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        id: "/RIA-AI-Drudge/",
        name: "CFP AI REPORT",
        short_name: "CFP AI",
        description: "AI headlines for advisors, CFPs, RIAs, and wealth professionals.",
        theme_color: "#2f4e75",
        background_color: "#eeeeee",
        display: "standalone",
        start_url: base,
        scope: base,
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        ],
      },
      workbox: {
        // JSON stays out of the precache. Headlines refresh hourly and are
        // served stale-while-revalidate from a cache named only for this site.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            urlPattern: /\/RIA-AI-Drudge\/data\/.+\.json$/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "cfp-ai-report-data-v1",
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 12 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    target: "es2022",
    outDir: "dist",
  },
});
