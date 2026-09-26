"use client";

import { FormEvent, useState } from "react";

type Props = {
  sectionId: string;
  title: string;
  description: string;
  phone: string;
  location: string;
};

export function ContactBlock({
  sectionId,
  title,
  description,
  phone,
  location,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not send message");
      }
      form.reset();
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id={sectionId || "contact"} className="msco-contact">
      <div className="msco-contact__grid">
        <div className="msco-contact__intro">
          <p className="msco-eyebrow">Consultation</p>
          <h2>{title}</h2>
          <p className="msco-contact__desc">{description}</p>
          <a className="msco-contact__phone" href={`tel:${phone.replace(/\D/g, "")}`}>
            {phone}
          </a>
          <p className="msco-contact__location">{location}</p>
        </div>
        <form className="msco-contact__form" onSubmit={onSubmit}>
          <label>
            Name
            <input name="name" required placeholder="Your full name" />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" placeholder="(555) 555-5555" />
          </label>
          <label>
            Message
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us about your security needs"
            />
          </label>
          <button
            type="submit"
            className="msco-btn msco-btn--primary"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending…" : "Submit Message"}
          </button>
          {status === "ok" ? (
            <p className="msco-form-ok">
              Thank you — we received your inquiry and will be in touch.
            </p>
          ) : null}
          {status === "error" ? (
            <p className="msco-form-error">{error}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
