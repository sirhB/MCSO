import { hash } from "bcryptjs";
import { OWNER_ADMIN } from "@/lib/admin-accounts";
import { prisma, resetPrismaClient } from "@/lib/prisma";

/** Ensure Michael's owner row exists (idempotent). */
export async function ensureOwnerAdmin() {
  const email = OWNER_ADMIN.email.toLowerCase();
  const passwordHash = await hash(OWNER_ADMIN.password, 10);
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: OWNER_ADMIN.name,
        passwordHash,
        isDemo: false,
      },
    });
    return existing.id;
  }

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
 * Schema creation is handled by `npm run build` / `npm start` bootstrap
 * (no child_process here — that breaks the Next Edge compile on Hostinger).
 */
export async function ensureDatabaseReady() {
  const { ensureRuntimeEnv } = await import("@/lib/runtime-env");
  ensureRuntimeEnv();
  resetPrismaClient();

  await prisma.$queryRaw`SELECT 1`;
  await ensureOwnerAdmin();
}
