import { prisma } from "@/lib/prisma";
import { DEMO_ADMIN, isDemoEmail } from "@/lib/admin-accounts";

export { DEMO_ADMIN, isDemoEmail };

/** True until Michael (or another owner) has completed /admin/setup. Demo does not count. */
export async function needsOwnerSetup() {
  const ownerCount = await prisma.user.count({ where: { isDemo: false } });
  return ownerCount === 0;
}

export async function ownerAdminCount() {
  return prisma.user.count({ where: { isDemo: false } });
}
