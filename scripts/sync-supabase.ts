import { restoreFromSupabaseIfEmpty, backupToSupabase } from "../src/lib/backup";

async function main() {
  const restored = await restoreFromSupabaseIfEmpty();
  if (!restored) {
    await backupToSupabase();
  }
  console.log("Supabase Storage sync finished.");
}

main().catch((err) => {
  console.warn("Supabase Storage sync skipped:", err);
});
