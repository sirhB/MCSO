"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TemplateCard = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pageSlug: string;
  previewTone: "dark" | "light";
  highlights: string[];
  isActive: boolean;
  publishedAt: string | null;
  updatedAt: string | null;
};

export default function AdminDesignsPage() {
  const [templates, setTemplates] = useState<TemplateCard[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<string>("editorial");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setTemplates(data.templates || []);
      setActiveTemplate(data.activeTemplate || "editorial");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load templates.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function activate(id: string) {
    setBusyId(id);
    setMessage("");
    setError("");
    const res = await fetch("/api/templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: id }),
    });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) {
      setError(data.error || "Could not activate template.");
      return;
    }
    setActiveTemplate(id);
    setTemplates((prev) =>
      prev.map((t) => ({ ...t, isActive: t.id === id })),
    );
    setMessage(`${id === "authority" ? "Daylight Authority" : "Editorial Night"} is now live.`);
  }

  return (
    <>
      <h1>Design templates</h1>
      <p className="lede">
        Each template keeps its own content. Switch the live layout anytime —
        the inactive design and its copy stay intact for later.
      </p>

      {loading ? <p>Loading templates…</p> : null}
      {error ? <p className="msco-form-error">{error}</p> : null}
      {message ? (
        <p className="msco-form-ok" style={{ color: "#15803d" }}>
          {message}
        </p>
      ) : null}

      <div className="design-grid">
        {templates.map((template) => (
          <article
            key={template.id}
            className={`design-card design-card--${template.previewTone} ${template.isActive ? "is-active" : ""}`}
          >
            <div className="design-card__preview" aria-hidden>
              <span className="design-card__brand">MCSO</span>
              <span className="design-card__bar" />
              <span className="design-card__bar design-card__bar--short" />
            </div>
            <div className="design-card__body">
              <div className="design-card__meta">
                <h2>{template.name}</h2>
                {template.isActive ? (
                  <span className="design-card__badge">Live</span>
                ) : null}
              </div>
              <p className="design-card__tagline">{template.tagline}</p>
              <p>{template.description}</p>
              <ul>
                {template.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="design-card__actions">
                <Link
                  href={`/admin/editor?template=${template.id}`}
                  className="admin-btn admin-btn--ghost"
                >
                  Edit content
                </Link>
                <Link
                  href={`/?previewTemplate=${template.id}`}
                  target="_blank"
                  className="admin-btn admin-btn--ghost"
                >
                  Preview
                </Link>
                <button
                  type="button"
                  className="admin-btn admin-btn--gold"
                  disabled={template.isActive || busyId === template.id}
                  onClick={() => activate(template.id)}
                >
                  {template.isActive
                    ? "Currently live"
                    : busyId === template.id
                      ? "Activating…"
                      : "Make live"}
                </button>
              </div>
              <p className="design-card__footnote">
                Active site template: <strong>{activeTemplate}</strong>
                {template.publishedAt
                  ? ` · Last published ${new Date(template.publishedAt).toLocaleString()}`
                  : ""}
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
