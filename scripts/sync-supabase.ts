import { restoreFromSupabaseIfEmpty, backupToSupabase } from "../src/lib/backup";

async function main() {
  const mode = process.argv[2] || "all";

  if (mode === "restore" || mode === "all") {
    const restored = await restoreFromSupabaseIfEmpty();
    console.log(restored ? "Restored snapshot from Supabase." : "No restore needed.");
    if (mode === "restore") return;
    if (restored) {
      console.log("Skipping backup after successful restore.");
      return;
    }
  }

  if (mode === "backup" || mode === "all") {
    await backupToSupabase();
    console.log("Backup to Supabase Storage finished.");
  }
}

main().catch((err) => {
  console.warn("Supabase Storage sync skipped:", err);
});
