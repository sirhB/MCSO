"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { OWNER_ADMIN } from "@/lib/admin-accounts";

export function ForcePasswordChange() {
  const [required, setRequired] = useState(false);
  const [checking, setChecking] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/account");
      const data = await res.json().catch(() => ({}));
      setRequired(Boolean(data.mustChangePassword));
    } catch {
      setRequired(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword === OWNER_ADMIN.password) {
      setError("Choose a different password than the temporary one.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: currentPassword || OWNER_ADMIN.password,
        newPassword,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Could not update password.");
      return;
    }

    const login = await signIn("credentials", {
      email: data.user?.email,
      password: newPassword,
      redirect: false,
    });
    setLoading(false);
    if (login?.error) {
      setError("Password saved. Please sign in again with your new password.");
      return;
    }

    setRequired(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  if (checking || !required) return null;

  return (
    <div
      className="password-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-gate-title"
    >
      <form className="password-gate__sheet" onSubmit={onSubmit}>
        <p className="password-gate__eyebrow">Security required</p>
        <h2 id="password-gate-title">Change your temporary password</h2>
        <p>
          You&apos;re still using the starter password (<code>changeme123</code>
          ). Choose a new password before managing the site. This prompt stays
          until you change it.
        </p>

        <label>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="changeme123"
            required
          />
        </label>
        <label>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            placeholder="At least 8 characters"
          />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        {error ? <p className="msco-form-error">{error}</p> : null}

        <button
          type="submit"
          className="admin-btn admin-btn--gold"
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
