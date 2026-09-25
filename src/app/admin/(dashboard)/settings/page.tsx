"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function AdminSettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
        }
      })
      .catch(() => setError("Could not load your account."));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setLoading(false);
      setError("New passwords do not match.");
      return;
    }

    const payload: Record<string, string> = { name, email };
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoading(false);
      setError(data.error || "Could not save changes.");
      return;
    }

    if (data.emailChanged || data.passwordChanged) {
      const login = await signIn("credentials", {
        email: data.user.email,
        password: newPassword || currentPassword,
        redirect: false,
      });
      if (login?.error) {
        setMessage(
          "Account updated. Please sign in again with your new email or password.",
        );
        setLoading(false);
        return;
      }
      await update();
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("Your account settings were saved.");
    setLoading(false);
  }

  return (
    <>
      <h1>Settings</h1>
      <p className="lede">
        Update your username, sign-in email, or password. Signed in as{" "}
        {session?.user?.email || "admin"}.
      </p>

      <form className="admin-card" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
          Username
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            style={{ padding: 12, fontSize: 16 }}
          />
        </label>
        <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
          Email (used to sign in)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 12, fontSize: 16 }}
          />
        </label>

        <h2 style={{ margin: "1.25rem 0 0.75rem", fontSize: "1.15rem" }}>
          Confirm with current password
        </h2>
        <p style={{ color: "#6b655c", marginTop: 0 }}>
          Required when changing email or password.
        </p>
        <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            style={{ padding: 12, fontSize: 16 }}
          />
        </label>

        <h2 style={{ margin: "1.25rem 0 0.75rem", fontSize: "1.15rem" }}>
          Change password
        </h2>
        <p style={{ color: "#6b655c", marginTop: 0 }}>
          Leave blank to keep your current password.
        </p>
        <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            style={{ padding: 12, fontSize: 16 }}
          />
        </label>
        <label style={{ display: "grid", gap: 6, marginBottom: 14 }}>
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
            style={{ padding: 12, fontSize: 16 }}
          />
        </label>

        {error ? <p className="msco-form-error">{error}</p> : null}
        {message ? <p className="msco-form-ok" style={{ color: "#15803d" }}>{message}</p> : null}

        <button
          type="submit"
          className="admin-btn admin-btn--gold"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "Saving…" : "Save settings"}
        </button>
      </form>
    </>
  );
}
