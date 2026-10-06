"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DEMO_ADMIN } from "@/lib/admin-accounts";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    fetch("/api/setup/status")
      .then((r) => r.json())
      .then((data) => {
        setNeedsSetup(Boolean(data.needsSetup));
      })
      .catch(() => setNeedsSetup(false));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email or password is incorrect.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  function fillDemoCredentials() {
    const email = document.querySelector<HTMLInputElement>('input[name="email"]');
    const password = document.querySelector<HTMLInputElement>(
      'input[name="password"]',
    );
    if (email) email.value = DEMO_ADMIN.email;
    if (password) password.value = DEMO_ADMIN.password;
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>MCSO Admin</h1>
        <p>Sign in to manage inquiries, contacts, and the website editor.</p>
        {needsSetup ? (
          <p>
            Owner account not created yet.{" "}
            <Link href="/admin/setup">Create Michael&apos;s account</Link>
            {" "}or use the demo login below.
          </p>
        ) : null}
        <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
          Demo (testing): <code>{DEMO_ADMIN.email}</code> /{" "}
          <code>{DEMO_ADMIN.password}</code>{" "}
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            style={{ marginLeft: "0.35rem", padding: "0.2rem 0.55rem" }}
            onClick={fillDemoCredentials}
          >
            Fill
          </button>
        </p>
        <label>
          Email
          <input name="email" type="email" required autoComplete="username" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="msco-form-error">{error}</p> : null}
        <button
          type="submit"
          className="admin-btn admin-btn--gold"
          style={{ width: "100%", marginTop: "0.5rem" }}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
