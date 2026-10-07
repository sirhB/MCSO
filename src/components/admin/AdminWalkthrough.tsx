"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DONE_KEY = "mcso-admin-walkthrough-v1";
const STEP_KEY = "mcso-admin-walkthrough-step-v1";

const STEPS = [
  {
    title: "Welcome, Michael",
    body: "This is your MCSO admin. From your phone you can review leads, reply by email, manage contacts and gallery photos, and update the website.",
    href: "/admin",
    cta: "Continue",
  },
  {
    title: "Dashboard",
    body: "Your home base. See new inquiry counts and jump straight into replies or the site editor.",
    href: "/admin",
    cta: "Next: Inquiries",
  },
  {
    title: "Inquiries",
    body: "Every website contact form submission lands here. Tap Reply by email to open a ready message in your mail app.",
    href: "/admin/inquiries",
    cta: "Open Inquiries",
  },
  {
    title: "Contact book",
    body: "People who inquired are saved automatically. Call or email them anytime from this list.",
    href: "/admin/contacts",
    cta: "Open Contacts",
  },
  {
    title: "Gallery",
    body: "Keep site photos organized. Upload and label images that appear on the public homepage.",
    href: "/admin/gallery",
    cta: "Open Gallery",
  },
  {
    title: "Site editor",
    body: "Edit homepage sections visually, then publish. A larger screen helps for long edits.",
    href: "/admin/editor",
    cta: "Open Editor",
  },
  {
    title: "Settings",
    body: "Update your name, email, or password. Change changeme123 after your first sign-in.",
    href: "/admin/settings",
    cta: "Finish tour",
  },
] as const;

export function AdminWalkthrough() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function maybeOpen() {
      try {
        if (window.localStorage.getItem(DONE_KEY) === "done") return;
        // Wait until the temporary password is changed so the security prompt wins.
        const res = await fetch("/api/account");
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (data.mustChangePassword) return;

        const saved = Number(window.sessionStorage.getItem(STEP_KEY) || "0");
        setStep(
          Number.isFinite(saved)
            ? Math.min(Math.max(saved, 0), STEPS.length - 1)
            : 0,
        );
        setOpen(true);
      } catch {
        if (!cancelled) setOpen(true);
      }
    }

    void maybeOpen();
    return () => {
      cancelled = true;
    };
  }, []);

  function persistStep(next: number) {
    setStep(next);
    try {
      window.sessionStorage.setItem(STEP_KEY, String(next));
    } catch {
      // ignore
    }
  }

  function finish() {
    try {
      window.localStorage.setItem(DONE_KEY, "done");
      window.sessionStorage.removeItem(STEP_KEY);
    } catch {
      // ignore
    }
    setOpen(false);
  }

  function next() {
    if (step >= STEPS.length - 1) {
      finish();
      return;
    }
    persistStep(step + 1);
  }

  if (!open) return null;

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;
  const isLast = step >= STEPS.length - 1;

  return (
    <div className="walkthrough" role="dialog" aria-modal="true" aria-label="MCSO admin tour">
      <div className="walkthrough__sheet">
        <div className="walkthrough__progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="walkthrough__step">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2>{current.title}</h2>
        <p>{current.body}</p>
        <div className="walkthrough__actions">
          {isLast ? (
            <button type="button" className="admin-btn admin-btn--gold" onClick={finish}>
              {current.cta}
            </button>
          ) : (
            <>
              <Link
                href={current.href}
                className="admin-btn admin-btn--gold"
                onClick={next}
              >
                {current.cta}
              </Link>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={next}>
                Next tip
              </button>
            </>
          )}
          <button type="button" className="walkthrough__skip" onClick={finish}>
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
