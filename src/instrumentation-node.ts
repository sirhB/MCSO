/**
 * Node-only startup work. Kept out of src/instrumentation.ts so the Edge
 * instrumentation bundle does not try to resolve fs/path/child_process.
 */
export async function registerNode() {
  await import("@/lib/runtime-env");

  try {
    const { ensureDatabaseReady } = await import("@/lib/ensure-owner");
    await ensureDatabaseReady();
  } catch (err) {
    console.warn("[startup] ensureDatabaseReady failed:", err);
  }

  try {
    const { restoreFromSupabaseIfEmpty } = await import("@/lib/backup");
    const { ensureGalleryDefaults } = await import("@/lib/ensure-gallery");
    const restored = await restoreFromSupabaseIfEmpty();
    if (!restored) {
      await ensureGalleryDefaults();
    }
    const { ensureOwnerAdmin } = await import("@/lib/ensure-owner");
    await ensureOwnerAdmin();
  } catch (err) {
    console.warn("[startup] restore/seed skipped:", err);
  }
}
