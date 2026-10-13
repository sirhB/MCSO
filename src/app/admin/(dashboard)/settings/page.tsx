"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  DEFAULT_REPLY_PHRASES,
  type ReplyPhrases,
} from "@/lib/reply-phrases";

export default function AdminSettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [replyPhrases, setReplyPhrases] = useState<ReplyPhrases>(
    DEFAULT_REPLY_PHRASES,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phrasesLoading, setPhrasesLoading] = useState(false);
  const [phrasesMessage, setPhrasesMessage] = useState("");
  const [phrasesError, setPhrasesError] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    fetch("/api/account")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
        }
        setMustChangePassword(Boolean(data.mustChangePassword));
      })
      .catch(() => setError("Could not load your account."));

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.replyPhrases) setReplyPhrases(data.replyPhrases);
      })
      .catch(() => {
        // Defaults remain usable offline.
      });
  }, []);

  async function onSubmitAccount(e: FormEvent) {
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
    if (data.passwordChanged) setMustChangePassword(false);
    setMessage("Your account settings were saved.");
    setLoading(false);
  }

  async function onSubmitPhrases(e: FormEvent) {
    e.preventDefault();
    setPhrasesLoading(true);
    setPhrasesError("");
    setPhrasesMessage("");

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ replyPhrases }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setPhrasesLoading(false);
      setPhrasesError(data.error || "Could not save common phrases.");
      return;
    }

    if (data.replyPhrases) setReplyPhrases(data.replyPhrases);
    setPhrasesMessage("Common reply phrases saved.");
    setPhrasesLoading(false);
  }

  return (
    <>
      <h1>Settings</h1>
      <p className="lede">
        Edit account info, change your password, and set common reply phrases
        used when you tap Reply by email. Signed in as{" "}
        {session?.user?.email || "admin"}.
      </p>

      {mustChangePassword ? (
        <p className="msco-form-error" style={{ maxWidth: 520 }}>
          You are still using the temporary password. Change it below to continue
          using the admin panel securely.
        </p>
      ) : null}

      <form className="admin-card" onSubmit={onSubmitAccount} style={{ maxWidth: 520 }}>
        <h2 className="admin-settings-section" style={{ marginTop: 0 }}>
          Account info
        </h2>
        <p className="admin-settings-hint">
          Update your username and sign-in email.
        </p>

        <label className="admin-field">
          Username
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            autoComplete="username"
          />
        </label>
        <label className="admin-field">
          Email (used to sign in)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <h2 className="admin-settings-section">Confirm with current password</h2>
        <p className="admin-settings-hint">
          Required when changing email or password.
        </p>
        <label className="admin-field">
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <h2 className="admin-settings-section">Change password</h2>
        <p className="admin-settings-hint">
          Leave blank to keep your current password.
        </p>
        <label className="admin-field">
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </label>
        <label className="admin-field">
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
          />
        </label>

        {error ? <p className="msco-form-error">{error}</p> : null}
        {message ? (
          <p className="msco-form-ok" style={{ color: "#15803d" }}>
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          className="admin-btn admin-btn--gold"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? "Saving…" : "Save account"}
        </button>
      </form>

      <form
        className="admin-card"
        onSubmit={onSubmitPhrases}
        style={{ maxWidth: 520, marginTop: "1.25rem" }}
      >
        <h2 className="admin-settings-section" style={{ marginTop: 0 }}>
          Common reply phrases
        </h2>
        <p className="admin-settings-hint">
          These fill in the ready-to-send email when you reply to an inquiry.
          The contact&apos;s name and their original message are added
          automatically.
        </p>

        <label className="admin-field">
          Email subject
          <input
            value={replyPhrases.subject}
            onChange={(e) =>
              setReplyPhrases((prev) => ({ ...prev, subject: e.target.value }))
            }
            required
            maxLength={200}
          />
        </label>
        <label className="admin-field">
          Opening line
          <textarea
            value={replyPhrases.intro}
            onChange={(e) =>
              setReplyPhrases((prev) => ({ ...prev, intro: e.target.value }))
            }
            required
            maxLength={2000}
          />
        </label>
        <label className="admin-field">
          Sign-off
          <textarea
            value={replyPhrases.signOff}
            onChange={(e) =>
              setReplyPhrases((prev) => ({ ...prev, signOff: e.target.value }))
            }
            required
            maxLength={500}
            style={{ minHeight: "4.5rem" }}
          />
        </label>

        {phrasesError ? <p className="msco-form-error">{phrasesError}</p> : null}
        {phrasesMessage ? (
          <p className="msco-form-ok" style={{ color: "#15803d" }}>
            {phrasesMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className="admin-btn admin-btn--gold"
          disabled={phrasesLoading}
          style={{ marginTop: 8 }}
        >
          {phrasesLoading ? "Saving…" : "Save common phrases"}
        </button>
      </form>
    </>
  );
}
