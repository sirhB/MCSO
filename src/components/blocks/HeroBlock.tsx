"use client";

type Props = {
  brandName?: string;
  subtitle: string;
  title: string;
  titleAccent: string;
  description: string;
  backgroundImage: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
};

export function HeroBlock(props: Props) {
  return (
    <section id="top" className="msco-hero">
      <div
        className="msco-hero__bg"
        style={{ backgroundImage: `url(${props.backgroundImage})` }}
      />
      <div className="msco-hero__veil" />
      <div className="msco-hero__atmosphere" aria-hidden />
      <div className="msco-hero__content">
        <p className="msco-hero__brand">{props.brandName || "MCSO"}</p>
        <p className="msco-hero__subtitle">{props.subtitle}</p>
        <h1 className="msco-hero__title">
          {props.title}
          <br />
          <em>{props.titleAccent}</em>
        </h1>
        <p className="msco-hero__desc">{props.description}</p>
        <div className="msco-hero__actions">
          <a href={props.primaryHref} className="msco-btn msco-btn--primary">
            {props.primaryCta}
          </a>
          <a href={props.secondaryHref} className="msco-btn msco-btn--ghost">
            {props.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}
