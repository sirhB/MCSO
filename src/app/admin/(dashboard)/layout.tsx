import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Demo can use the admin while Michael still completes one-time /admin/setup.
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="admin-main">{children}</main>
    </div>
  );
}
