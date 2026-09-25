"use client";

import { FormEvent, useEffect, useState } from "react";

type Item = {
  id: string;
  src: string;
  label: string | null;
  description: string | null;
  category: string;
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const file = form.get("file");
    if (!(file instanceof File) || !file.size) {
      setBusy(false);
      setMessage("Choose a photo first.");
      return;
    }

    const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) {
      setBusy(false);
      setMessage(uploadData.error || "Upload failed");
      return;
    }

    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        src: uploadData.src,
        label: form.get("label"),
        description: form.get("description"),
        category: form.get("category") || "General",
      }),
    });

    formEl.reset();
    setBusy(false);
    setMessage("Photo added to the gallery.");
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Remove this photo from the gallery?")) return;
    await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <>
      <h1>Gallery</h1>
      <p className="lede">
        Upload photos here. The website gallery section pulls from this list
        automatically.
      </p>

      <form className="admin-card" onSubmit={onUpload} style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginTop: 0 }}>Add a photo</h2>
        <div style={{ display: "grid", gap: "0.85rem", maxWidth: 520 }}>
          <label>
            Photo file
            <input name="file" type="file" accept="image/*" required style={{ display: "block", marginTop: 6 }} />
          </label>
          <label>
            Label
            <input name="label" placeholder="e.g. Patrol Unit" style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }} />
          </label>
          <label>
            Short description
            <input name="description" placeholder="e.g. Night operations" style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }} />
          </label>
          <label>
            Category
            <select name="category" defaultValue="Tactical Fleet" style={{ display: "block", width: "100%", padding: 10, marginTop: 6 }}>
              <option>Tactical Fleet</option>
              <option>Meet the Team</option>
              <option>Executive Protection</option>
              <option>General</option>
            </select>
          </label>
          <button type="submit" className="admin-btn admin-btn--gold" disabled={busy}>
            {busy ? "Uploading…" : "Upload photo"}
          </button>
          {message ? <p>{message}</p> : null}
        </div>
      </form>

      <div className="msco-gallery__grid">
        {items.map((item) => (
          <div key={item.id} className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.label || ""} style={{ width: "100%", height: 180, objectFit: "cover" }} />
            <div style={{ padding: "0.85rem" }}>
              <strong>{item.label || "Untitled"}</strong>
              <div style={{ color: "#78716c", fontSize: "0.9rem" }}>{item.category}</div>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                style={{ marginTop: "0.75rem" }}
                onClick={() => remove(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
