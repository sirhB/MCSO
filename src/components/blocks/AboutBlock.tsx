"use client";

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
  return (
    <section id={sectionId || "about"} className="msco-about">
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
