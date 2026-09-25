export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;

  await import("@/lib/runtime-env");
  const { restoreFromSupabaseIfEmpty } = await import("@/lib/backup");
  const { ensureGalleryDefaults } = await import("@/lib/ensure-gallery");

  try {
    const restored = await restoreFromSupabaseIfEmpty();
    if (!restored) {
      await ensureGalleryDefaults();
    }
  } catch (err) {
    console.warn("[startup] restore/seed skipped:", err);
  }
}
