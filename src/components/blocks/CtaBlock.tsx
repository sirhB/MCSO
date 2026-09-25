"use client";

type Props = {
  heading: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
};

export function CtaBlock({ heading, body, buttonLabel, buttonHref }: Props) {
  return (
    <section className="msco-cta">
      <h2>{heading}</h2>
      <p>{body}</p>
      <a href={buttonHref} className="msco-btn msco-btn--primary">
        {buttonLabel}
      </a>
    </section>
  );
}
