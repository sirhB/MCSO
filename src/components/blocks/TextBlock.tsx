"use client";

type Props = {
  eyebrow: string;
  heading: string;
  body: string;
  align: "left" | "center";
};

export function TextBlock({ eyebrow, heading, body, align }: Props) {
  return (
    <section
      className={`msco-textblock msco-textblock--${align}`}
      style={{ textAlign: align }}
    >
      {eyebrow ? <p className="msco-eyebrow">{eyebrow}</p> : null}
      <h2>{heading}</h2>
      <p>{body}</p>
    </section>
  );
}
