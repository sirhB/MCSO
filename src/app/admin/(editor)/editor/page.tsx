"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig, type MCSOProps } from "@/lib/puck-config";
import { defaultHomeData } from "@/lib/default-page-data";

export default function EditorPage() {
  const [data, setData] = useState<Data<MCSOProps> | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/pages?slug=home")
      .then((r) => r.json())
      .then((payload) => {
        setData(payload.page?.draftData || defaultHomeData);
      })
      .catch(() => setData(defaultHomeData));
  }, []);

  const save = useCallback(
    async (next: Data<MCSOProps>, publish: boolean) => {
      setBusy(true);
      setStatus(publish ? "Publishing…" : "Saving draft…");
      const res = await fetch("/api/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: "home",
          title: "MCSO Security Group",
          data: next,
          publish,
        }),
      });
      setBusy(false);
      if (!res.ok) {
        setStatus("Could not save. Please try again.");
        return;
      }
      setData(next);
      setStatus(
        publish
          ? "Published! The live website is updated."
          : "Draft saved. Click Publish when ready.",
      );
    },
    [],
  );

  if (!data) {
    return (
      <div style={{ padding: "2rem", background: "#1c1917", color: "#fff", minHeight: "100vh" }}>
        Loading site editor…
      </div>
    );
  }

  return (
    <div>
      <div className="editor-topbar">
        <div>
          <h1>Website Editor</h1>
          <p style={{ margin: 0, color: "#a8a29e", fontSize: "0.9rem" }}>
            Drag blocks from the left. Click any section to edit text and images. Large Publish button when done.
          </p>
        </div>
        <div className="actions">
          <Link href="/admin" className="admin-btn admin-btn--ghost" style={{ color: "#fff", borderColor: "#44403c" }}>
            Back to admin
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            style={{ color: "#fff", borderColor: "#44403c" }}
            disabled={busy}
            onClick={() => save(data, false)}
          >
            Save draft
          </button>
          <button
            type="button"
            className="admin-btn admin-btn--gold"
            disabled={busy}
            onClick={() => save(data, true)}
          >
            Publish to website
          </button>
        </div>
      </div>
      {status ? (
        <div style={{ background: "#fff8e7", color: "#1c1917", padding: "0.65rem 1rem", fontWeight: 600 }}>
          {status}
        </div>
      ) : null}
      <div className="editor-frame">
        <Puck
          config={puckConfig}
          data={data}
          onChange={(next) => setData(next)}
          onPublish={async (next) => {
            await save(next, true);
          }}
          headerPath="/"
          iframe={{ enabled: false }}
        />
      </div>
    </div>
  );
}
