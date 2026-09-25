"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  INQUIRY_STATUSES,
  PIPELINE_FLOW,
  STATUS_COLORS,
  STATUS_LABELS,
  type InquiryStatus,
} from "@/lib/inquiry-status";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
  contact: { id: string; name: string; email: string; phone: string | null } | null;
  statusHistory: {
    id: string;
    fromStatus: string | null;
    toStatus: string;
    note: string | null;
    createdAt: string;
  }[];
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/inquiries");
    const data = await res.json();
    setInquiries(data.inquiries || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const byStatus = useMemo(() => {
    const map: Record<string, Inquiry[]> = {};
    for (const status of INQUIRY_STATUSES) map[status] = [];
    for (const item of inquiries) {
      (map[item.status] || (map[item.status] = [])).push(item);
    }
    return map;
  }, [inquiries]);

  async function updateStatus(id: string, status: InquiryStatus) {
    setSaving(true);
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.inquiry) {
      setSelected(data.inquiry);
      await load();
    }
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    const res = await fetch(`/api/inquiries/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: selected.notes }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.inquiry) {
      setSelected(data.inquiry);
      await load();
    }
  }

  return (
    <>
      <h1>Inquiries</h1>
      <p className="lede">
        Track every lead from first message to won or lost. Click a card for
        phone, email, and history.
      </p>

      <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Inquiry flow</h2>
      <div className="flow-chart" aria-label="Inquiry status flowchart">
        {PIPELINE_FLOW.map((status, index) => (
          <div key={status} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              className={`flow-node ${(byStatus[status]?.length || 0) > 0 ? "is-hot" : ""}`}
              style={{ borderColor: STATUS_COLORS[status] }}
            >
              {STATUS_LABELS[status]}
              <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#78716c" }}>
                {byStatus[status]?.length || 0}
              </div>
            </div>
            {index < PIPELINE_FLOW.length - 1 ? (
              <span className="flow-arrow">→</span>
            ) : null}
          </div>
        ))}
        <span className="flow-arrow">/</span>
        <div
          className={`flow-node ${(byStatus.LOST?.length || 0) > 0 ? "is-hot" : ""}`}
          style={{ borderColor: STATUS_COLORS.LOST }}
        >
          Lost
          <div style={{ fontSize: "0.8rem", fontWeight: 500, color: "#78716c" }}>
            {byStatus.LOST?.length || 0}
          </div>
        </div>
      </div>

      <div className="pipeline">
        {INQUIRY_STATUSES.map((status) => (
          <div key={status} className="pipeline-col">
            <h3>
              <span>{STATUS_LABELS[status]}</span>
              <span>{byStatus[status]?.length || 0}</span>
            </h3>
            {(byStatus[status] || []).map((item) => (
              <button
                key={item.id}
                type="button"
                className="inquiry-card"
                style={{ width: "100%", textAlign: "left" }}
                onClick={() => setSelected(item)}
              >
                <strong>{item.name}</strong>
                <small>
                  {item.email}
                  {item.phone ? ` · ${item.phone}` : ""}
                </small>
              </button>
            ))}
          </div>
        ))}
      </div>

      {selected ? (
        <div className="admin-card" style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0 }}>{selected.name}</h2>
              <p style={{ margin: "0.4rem 0", color: "#57534e" }}>
                Received {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>

          <div style={{ display: "grid", gap: "0.5rem", margin: "1rem 0" }}>
            <div>
              <strong>Email: </strong>
              <a href={`mailto:${selected.email}`}>{selected.email}</a>
            </div>
            <div>
              <strong>Phone: </strong>
              {selected.phone ? (
                <a href={`tel:${selected.phone.replace(/\D/g, "")}`}>{selected.phone}</a>
              ) : (
                "—"
              )}
            </div>
            <div>
              <strong>Message:</strong>
              <p style={{ margin: "0.35rem 0 0", whiteSpace: "pre-wrap" }}>{selected.message}</p>
            </div>
          </div>

          <label style={{ display: "grid", gap: "0.4rem", marginBottom: "1rem" }}>
            <strong>Move to status</strong>
            <select
              value={selected.status}
              disabled={saving}
              onChange={(e) =>
                updateStatus(selected.id, e.target.value as InquiryStatus)
              }
              style={{ padding: "0.7rem", fontSize: "1rem", maxWidth: 280 }}
            >
              {INQUIRY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "0.4rem" }}>
            <strong>Admin notes</strong>
            <textarea
              rows={4}
              value={selected.notes || ""}
              onChange={(e) =>
                setSelected({ ...selected, notes: e.target.value })
              }
              style={{ padding: "0.75rem", fontSize: "1rem" }}
            />
          </label>
          <button
            type="button"
            className="admin-btn admin-btn--gold"
            style={{ marginTop: "0.75rem" }}
            disabled={saving}
            onClick={saveNotes}
          >
            Save notes
          </button>

          <h3 style={{ marginTop: "1.5rem" }}>Status history (flow)</h3>
          <ol>
            {selected.statusHistory.map((event) => (
              <li key={event.id} style={{ marginBottom: "0.4rem" }}>
                {event.fromStatus || "—"} → <strong>{event.toStatus}</strong>
                {event.note ? ` (${event.note})` : ""} ·{" "}
                {new Date(event.createdAt).toLocaleString()}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </>
  );
}
