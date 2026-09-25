"use client";

type Props = {
  src: string;
  alt: string;
  caption: string;
  fullBleed: boolean;
};

export function ImageBlock({ src, alt, caption, fullBleed }: Props) {
  return (
    <figure className={`msco-imageblock ${fullBleed ? "is-bleed" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
