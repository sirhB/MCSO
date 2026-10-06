"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminSetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbWarning, setDbWarning] = useState(false);

  useEffect(() => {
    fetch("/api/setup/status")
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          setDbWarning(true);
          setChecking(false);
          return;
        }
        if (data.warning === "database-unavailable") {
          setDbWarning(true);
        }
        if (!data.needsSetup) {
          router.replace("/admin/login");
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        setDbWarning(true);
        setChecking(false);
      });
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");

    if (password !== confirm) {
      setLoading(false);
      setError("Passwords do not match.");
      return;
    }

    const res = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(
        data.error ||
          (res.status >= 500
            ? "Server database error. Try the demo login on /admin/login, or redeploy the latest build on Hostinger."
            : "Could not create your account."),
      );
      return;
    }

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (login?.error) {
      router.push("/admin/login");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  if (checking) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Create your admin account</h1>
        <p>
          Welcome to MCSO. Create Michael&apos;s owner login (one-time setup).
          You can change these details later in Settings. A separate demo login
          is available for testing on the{" "}
          <Link href="/admin/login">sign-in page</Link>.
        </p>
        {dbWarning ? (
          <p className="msco-form-error">
            Database check failed on the server. You can still try below, or use
            the demo login after redeploying the latest build.
          </p>
        ) : null}
        <label>
          Username
          <input
            name="name"
            required
            minLength={2}
            autoComplete="username"
            placeholder="e.g. Michael"
          />
        </label>
        <label>
          Email (used to sign in)
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </label>
        <label>
          Confirm password
          <input
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </label>
        {error ? <p className="msco-form-error">{error}</p> : null}
        <button
          type="submit"
          className="admin-btn admin-btn--gold"
          style={{ width: "100%", marginTop: "0.5rem" }}
          disabled={loading}
        >
          {loading ? "Saving…" : "Save and continue"}
        </button>
      </form>
    </div>
  );
}
