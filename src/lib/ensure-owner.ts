import { compare, hash } from "bcryptjs";
import { OWNER_ADMIN } from "@/lib/admin-accounts";
import { prisma, resetPrismaClient } from "@/lib/prisma";

/** True while the account still uses the seeded temporary password. */
export async function passwordIsTemporary(passwordHash: string) {
  return compare(OWNER_ADMIN.password, passwordHash);
}

/** Ensure Michael's owner row exists (idempotent). Never resets a changed password. */
export async function ensureOwnerAdmin() {
  const email = OWNER_ADMIN.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    // Keep name in sync, but do not overwrite a password Michael already changed.
    if (existing.name !== OWNER_ADMIN.name) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { name: OWNER_ADMIN.name, isDemo: false },
      });
    }
    return existing.id;
  }

  const passwordHash = await hash(OWNER_ADMIN.password, 10);
  const created = await prisma.user.create({
    data: {
      name: OWNER_ADMIN.name,
      email,
      passwordHash,
      isDemo: false,
    },
  });
  return created.id;
}

/**
 * Re-resolve SQLite path and ensure the owner row exists.
 * Schema creation is handled by bootstrap on build/start.
 */
export async function ensureDatabaseReady() {
  const { ensureRuntimeEnv } = await import("@/lib/runtime-env");
  ensureRuntimeEnv();
  resetPrismaClient();

  await prisma.$queryRaw`SELECT 1`;
  await ensureOwnerAdmin();
}
