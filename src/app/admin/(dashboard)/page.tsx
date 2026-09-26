import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATUS_LABELS, type InquiryStatus } from "@/lib/inquiry-status";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [inquiryCount, newCount, contactCount, galleryCount, page] =
    await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.contact.count(),
      prisma.galleryImage.count(),
      prisma.sitePage.findUnique({ where: { slug: "home" } }),
    ]);

  const recent = await prisma.inquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <h1>Dashboard</h1>
      <p className="lede">
        Welcome. Use large buttons below — everything an admin needs in one place.
      </p>

      <div className="stat-grid">
        <div className="stat-card">
          <span>New inquiries</span>
          <strong>{newCount}</strong>
        </div>
        <div className="stat-card">
          <span>Total inquiries</span>
          <strong>{inquiryCount}</strong>
        </div>
        <div className="stat-card">
          <span>Contacts</span>
          <strong>{contactCount}</strong>
        </div>
        <div className="stat-card">
          <span>Gallery photos</span>
          <strong>{galleryCount}</strong>
        </div>
      </div>

      <div className="admin-actions">
        <Link href="/admin/editor" className="admin-btn admin-btn--gold">
          Edit website
        </Link>
        <Link href="/admin/inquiries" className="admin-btn">
          View inquiries
        </Link>
        <Link href="/admin/contacts" className="admin-btn admin-btn--ghost">
          Open contact book
        </Link>
        <Link href="/admin/gallery" className="admin-btn admin-btn--ghost">
          Manage gallery
        </Link>
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Site status</h2>
        <p>
          Homepage last published:{" "}
          <strong>
            {page?.publishedAt
              ? new Date(page.publishedAt).toLocaleString()
              : "Not published yet"}
          </strong>
        </p>
      </div>

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h2 style={{ marginTop: 0 }}>Recent inquiries</h2>
        {recent.length === 0 ? (
          <p>No inquiries yet.</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {recent.map((item) => (
              <li key={item.id} style={{ marginBottom: "0.6rem" }}>
                <strong>{item.name}</strong> — {item.email}
                {item.phone ? ` · ${item.phone}` : ""} ·{" "}
                {STATUS_LABELS[item.status as InquiryStatus] || item.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
