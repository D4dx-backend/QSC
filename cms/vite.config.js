import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "apple-touch-icon.svg",
        "logo.png",
      ],
      manifest: {
        name: "QSC Automation",
        short_name: "QSC",
        description:
          "Quran Study Centre — registrations, exam hall tickets, results and question papers.",
        theme_color: "#1a4993",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "en",
        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Cache the app shell + built assets. Runtime caching below covers
        // images and API-backed lookups so returning visitors get an instant
        // paint even on flaky mobile networks.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        // App bundle is large; raise the precache size ceiling so the main
        // chunk is allowed in. Keeps offline support usable.
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//, /^\/_/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            // CDN-served images (banners, question paper PDFs, etc.)
            urlPattern: ({ url }) =>
              /\.(?:png|jpg|jpeg|webp|gif|svg|pdf)$/i.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "qsc-media",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            // Public GET endpoints (about-us, question papers, results, etc.)
            // are safe to stale-while-revalidate; mutations use POST/PUT.
            urlPattern: ({ url, request }) =>
              request.method === "GET" && /\/api\//.test(url.pathname),
            handler: "NetworkFirst",
            options: {
              cacheName: "qsc-api-get",
              networkTimeoutSeconds: 6,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//,
            handler: "CacheFirst",
            options: {
              cacheName: "qsc-fonts",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    cors: true,
    hmr: {
      host: process.env.VITE_HMR_HOST || "localhost",
      port: process.env.PORT || 3000,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: ["*"],
  },
  preview: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    allowedHosts: ["event-hex-saad-vite-mzmxq.ondigitalocean.app"],
  },
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});