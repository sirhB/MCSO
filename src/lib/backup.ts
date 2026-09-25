import { getSupabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

const BUCKET = "mcso-app-data";
const OBJECT = "snapshot.json";

type Snapshot = {
  version: 1;
  savedAt: string;
  users: Record<string, unknown>[];
  pages: Record<string, unknown>[];
  contacts: Record<string, unknown>[];
  inquiries: Record<string, unknown>[];
  statusEvents: Record<string, unknown>[];
  gallery: Record<string, unknown>[];
};

async function ensureBucket() {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return true;
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
  });
  if (error && !/exist/i.test(error.message)) {
    console.warn("[backup] createBucket:", error.message);
    return false;
  }
  return true;
}

export async function exportSnapshot(): Promise<Snapshot> {
  const [users, pages, contacts, inquiries, statusEvents, gallery] =
    await Promise.all([
      prisma.user.findMany(),
      prisma.sitePage.findMany(),
      prisma.contact.findMany(),
      prisma.inquiry.findMany(),
      prisma.statusEvent.findMany(),
      prisma.galleryImage.findMany(),
    ]);
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    users: users as unknown as Record<string, unknown>[],
    pages: pages as unknown as Record<string, unknown>[],
    contacts: contacts as unknown as Record<string, unknown>[],
    inquiries: inquiries as unknown as Record<string, unknown>[],
    statusEvents: statusEvents as unknown as Record<string, unknown>[],
    gallery: gallery as unknown as Record<string, unknown>[],
  };
}

/** Upload full DB snapshot to Supabase Storage (SUPABASE_URL + API key only). */
export async function backupToSupabase() {
  const supabase = getSupabase();
  if (!supabase) return { ok: false as const, reason: "no-supabase" };
  try {
    const ready = await ensureBucket();
    if (!ready) return { ok: false as const, reason: "bucket" };
    const snapshot = await exportSnapshot();
    const body = JSON.stringify(snapshot);
    const { error } = await supabase.storage.from(BUCKET).upload(OBJECT, body, {
      upsert: true,
      contentType: "application/json",
    });
    if (error) {
      console.warn("[backup] upload:", error.message);
      return { ok: false as const, reason: "upload" };
    }
    return { ok: true as const };
  } catch (err) {
    console.warn("[backup] failed:", err);
    return { ok: false as const, reason: "error" };
  }
}

export async function downloadSnapshot(): Promise<Snapshot | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.storage.from(BUCKET).download(OBJECT);
    if (error || !data) return null;
    const text = await data.text();
    return JSON.parse(text) as Snapshot;
  } catch {
    return null;
  }
}

/**
 * If local SQLite is empty (fresh Hostinger deploy), restore from Supabase Storage.
 */
export async function restoreFromSupabaseIfEmpty() {
  const [users, pages, gallery] = await Promise.all([
    prisma.user.count(),
    prisma.sitePage.count(),
    prisma.galleryImage.count(),
  ]);
  if (users > 0 || pages > 0 || gallery > 0) return false;

  const snapshot = await downloadSnapshot();
  if (!snapshot) return false;

  try {
    // Clear then insert (SQLite has no skipDuplicates)
    await prisma.statusEvent.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.galleryImage.deleteMany();
    await prisma.sitePage.deleteMany();
    await prisma.user.deleteMany();

    if (snapshot.users?.length) {
      for (const row of snapshot.users) {
        await prisma.user.create({ data: row as never });
      }
    }
    if (snapshot.pages?.length) {
      for (const row of snapshot.pages) {
        await prisma.sitePage.create({ data: row as never });
      }
    }
    if (snapshot.contacts?.length) {
      for (const row of snapshot.contacts) {
        await prisma.contact.create({ data: row as never });
      }
    }
    if (snapshot.inquiries?.length) {
      for (const row of snapshot.inquiries) {
        await prisma.inquiry.create({ data: row as never });
      }
    }
    if (snapshot.statusEvents?.length) {
      for (const row of snapshot.statusEvents) {
        await prisma.statusEvent.create({ data: row as never });
      }
    }
    if (snapshot.gallery?.length) {
      for (const row of snapshot.gallery) {
        await prisma.galleryImage.create({ data: row as never });
      }
    }
    console.log("[backup] Restored snapshot from Supabase Storage:", snapshot.savedAt);
    return true;
  } catch (err) {
    console.warn("[backup] restore failed:", err);
    return false;
  }
}

let backupTimer: ReturnType<typeof setTimeout> | null = null;

/** Debounced backup after writes. */
export function scheduleBackup() {
  if (backupTimer) clearTimeout(backupTimer);
  backupTimer = setTimeout(() => {
    void backupToSupabase();
  }, 1500);
}
