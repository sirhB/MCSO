import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminWalkthrough } from "@/components/admin/AdminWalkthrough";
import { ForcePasswordChange } from "@/components/admin/ForcePasswordChange";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="admin-main">{children}</main>
      <ForcePasswordChange />
      <AdminWalkthrough />
    </div>
  );
}
