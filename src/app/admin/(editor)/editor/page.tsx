"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { puckConfig, type MCSOProps } from "@/lib/puck-config";
import {
  DESIGN_TEMPLATES,
  getTemplateMeta,
  isDesignTemplateId,
  type DesignTemplateId,
} from "@/lib/design-templates";
import { TemplateProvider } from "@/lib/template-context";

function EditorInner() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("template");
  const [templateId, setTemplateId] = useState<DesignTemplateId>(
    requested && isDesignTemplateId(requested) ? requested : "editorial",
  );
  const [data, setData] = useState<Data<MCSOProps> | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const meta = useMemo(() => getTemplateMeta(templateId), [templateId]);

  useEffect(() => {
    if (requested && isDesignTemplateId(requested) && requested !== templateId) {
      setTemplateId(requested);
    }
  }, [requested, templateId]);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setStatus("");
    fetch(`/api/pages?slug=${encodeURIComponent(meta.pageSlug)}`)
      .then((r) => r.json())
      .then((payload) => {
        if (!cancelled) {
          setData(payload.page?.draftData || meta.defaultData);
        }
      })
      .catch(() => {
        if (!cancelled) setData(meta.defaultData);
      });
    return () => {
      cancelled = true;
    };
  }, [meta]);

  const save = useCallback(
    async (next: Data<MCSOProps>, publish: boolean) => {
      setBusy(true);
      setStatus(publish ? "Publishing…" : "Saving draft…");
      const res = await fetch("/api/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: meta.pageSlug,
          title: `MCSO — ${meta.name}`,
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
          ? `Published “${meta.name}”. Activate it under Design templates to make it live.`
          : "Draft saved. Click Publish when ready.",
      );
    },
    [meta],
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
          <p className="editor-topbar__hint" style={{ margin: 0, color: "#a8a29e", fontSize: "0.9rem" }}>
            Editing <strong style={{ color: "#f5f2ea" }}>{meta.name}</strong> — each
            template has its own content. Drag blocks, then Publish.
          </p>
        </div>
        <div className="actions">
          <label className="editor-template-picker">
            <span>Template</span>
            <select
              value={templateId}
              onChange={(e) => {
                const next = e.target.value;
                if (isDesignTemplateId(next)) setTemplateId(next);
              }}
            >
              {DESIGN_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <Link href="/admin/designs" className="admin-btn admin-btn--ghost" style={{ color: "#fff", borderColor: "#44403c" }}>
            Designs
          </Link>
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
            Publish template
          </button>
        </div>
      </div>
      {status ? (
        <div style={{ background: "#fff8e7", color: "#1c1917", padding: "0.65rem 1rem", fontWeight: 600 }}>
          {status}
        </div>
      ) : null}
      <div className="editor-frame">
        <TemplateProvider templateId={templateId}>
          <div className="msco-site" data-template={templateId}>
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
        </TemplateProvider>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: "2rem", background: "#1c1917", color: "#fff", minHeight: "100vh" }}>
          Loading site editor…
        </div>
      }
    >
      <EditorInner />
    </Suspense>
  );
}
