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

/** Open DB, create missing schema via db push if needed, then seed owner. */
export async function ensureDatabaseReady() {
  // Re-resolve env in case startup cwd/permissions differ from build time.
  const { ensureRuntimeEnv } = await import("@/lib/runtime-env");
  ensureRuntimeEnv();
  resetPrismaClient();

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.warn("[db] ping failed, attempting schema push:", err);
    const { spawnSync } = await import("child_process");
    const push = spawnSync(
      "npx",
      ["prisma", "db", "push", "--accept-data-loss", "--skip-generate"],
      {
        env: process.env,
        encoding: "utf8",
        shell: process.platform === "win32",
      },
    );
    if (push.status !== 0) {
      console.warn("[db] prisma db push failed:", push.stderr || push.stdout);
      throw err;
    }
    resetPrismaClient();
    await prisma.$queryRaw`SELECT 1`;
  }

  await ensureOwnerAdmin();
}
