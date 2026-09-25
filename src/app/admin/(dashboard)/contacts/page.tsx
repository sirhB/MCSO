"use client";

import { useEffect, useState } from "react";

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  notes: string | null;
  createdAt: string;
  inquiries: {
    id: string;
    status: string;
    createdAt: string;
    message: string;
  }[];
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((data) => setContacts(data.contacts || []));
  }, []);

  const filtered = contacts.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <h1>Contact Book</h1>
      <p className="lede">
        Everyone who has inquired — ready to call or email, with their inquiry
        history attached.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email, or phone"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "0.9rem 1rem",
          fontSize: "1.05rem",
          marginBottom: "1.25rem",
          borderRadius: 8,
          border: "1px solid #d6d3d1",
        }}
      />

      <div className="admin-card" style={{ overflowX: "auto" }}>
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reach out</th>
              <th>Inquiries</th>
              <th>Latest message</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <strong>{contact.name}</strong>
                </td>
                <td>
                  <div>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                  {contact.phone ? (
                    <div>
                      <a href={`tel:${contact.phone.replace(/\D/g, "")}`}>
                        {contact.phone}
                      </a>
                    </div>
                  ) : (
                    <div style={{ color: "#a8a29e" }}>No phone</div>
                  )}
                </td>
                <td>{contact.inquiries.length}</td>
                <td style={{ maxWidth: 360 }}>
                  {contact.inquiries[0]
                    ? contact.inquiries[0].message.slice(0, 140)
                    : "—"}
                  {contact.inquiries[0] && contact.inquiries[0].message.length > 140
                    ? "…"
                    : ""}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4}>No contacts yet. They appear when someone submits the form.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
