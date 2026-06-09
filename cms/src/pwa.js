// PWA registration + lightweight update-available prompt.
// vite-plugin-pwa is configured with `registerType: "autoUpdate"`, so the
// service worker refreshes in the background. When a new version is ready
// we ask the user once before swapping, preserving any in-progress work.
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    try {
      const ok = window.confirm(
        "A new version is available. Reload now to update?"
      );
      if (ok) updateSW(true);
    } catch (_) {
      // no-op; background tabs will pick up the update on next load
    }
  },
  onOfflineReady() {
    // Intentionally silent — avoid noisy toast on every first visit.
  },
});
