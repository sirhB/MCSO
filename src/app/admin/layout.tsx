import { ForcePasswordChange } from "@/components/admin/ForcePasswordChange";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ForcePasswordChange />
    </>
  );
}
