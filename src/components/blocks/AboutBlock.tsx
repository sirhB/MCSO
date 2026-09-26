"use client";

import { useTemplate } from "@/lib/template-context";

type Chapter = {
  tag: string;
  title: string;
  description: string;
  image: string;
  quote?: string;
};

type Props = {
  sectionId: string;
  eyebrow: string;
  title: string;
  chapters: Chapter[];
};

export function AboutBlock({ sectionId, eyebrow, title, chapters }: Props) {
  const template = useTemplate();

  if (template === "authority") {
    return (
      <section id={sectionId || "about"} className="msco-about msco-about--authority">
        <div className="msco-about__intro">
          <p className="msco-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="msco-about__timeline">
          {chapters.map((chapter, index) => (
            <article
              key={`${chapter.title}-${index}`}
              className="msco-timeline-item"
            >
              <div className="msco-timeline-item__rail" aria-hidden>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="msco-timeline-item__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={chapter.image} alt={chapter.title} />
              </div>
              <div className="msco-timeline-item__copy">
                <span className="msco-chapter__tag">{chapter.tag}</span>
                <h3>{chapter.title}</h3>
                <p>{chapter.description}</p>
                {chapter.quote ? (
                  <blockquote>“{chapter.quote}”</blockquote>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId || "about"} className="msco-about">
      <div className="msco-about__glow" aria-hidden />
      <div className="msco-about__intro">
        <p className="msco-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="msco-about__chapters">
        {chapters.map((chapter, index) => (
          <article
            key={`${chapter.title}-${index}`}
            className={`msco-chapter ${index % 2 === 1 ? "msco-chapter--flip" : ""}`}
          >
            <div className="msco-chapter__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={chapter.image} alt={chapter.title} />
            </div>
            <div className="msco-chapter__copy">
              <span className="msco-chapter__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="msco-chapter__tag">{chapter.tag}</span>
              <h3>{chapter.title}</h3>
              <p>{chapter.description}</p>
              {chapter.quote ? (
                <blockquote>“{chapter.quote}”</blockquote>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
