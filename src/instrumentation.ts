export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

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
    // Owner must exist even after restore of an empty/legacy snapshot.
    const { ensureOwnerAdmin } = await import("@/lib/ensure-owner");
    await ensureOwnerAdmin();
  } catch (err) {
    console.warn("[startup] restore/seed skipped:", err);
  }
}
