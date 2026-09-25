"use client";

type Item = {
  title: string;
  tag: string;
  description: string;
  image: string;
};

type Props = {
  sectionId: string;
  title: string;
  description: string;
  items: Item[];
};

export function ServicesBlock({ sectionId, title, description, items }: Props) {
  return (
    <section id={sectionId || "services"} className="msco-services">
      <div className="msco-section-head">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="msco-services__grid">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="msco-service-card">
            <div className="msco-service-card__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} />
            </div>
            <div className="msco-service-card__body">
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href="#contact" className="msco-link">
                Get a Quote →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
