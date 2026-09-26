"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultGalleryAsApiItems } from "@/lib/default-gallery";
import { useTemplate } from "@/lib/template-context";

type GalleryItem = {
  id: string;
  src: string;
  label: string | null;
  description: string | null;
  category: string;
};

type Props = {
  sectionId: string;
  title: string;
  description: string;
  useDatabase: boolean;
  categories: string;
};

export function GalleryBlock({
  sectionId,
  title,
  description,
  useDatabase,
  categories,
}: Props) {
  const template = useTemplate();
  const fallback = useMemo(() => defaultGalleryAsApiItems(), []);
  const [items, setItems] = useState<GalleryItem[]>(fallback);
  const [active, setActive] = useState<string>("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const categoryList = useMemo(() => {
    const parsed = categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    return ["All", ...parsed];
  }, [categories]);

  useEffect(() => {
    if (!useDatabase) {
      setItems(fallback);
      return;
    }
    let cancelled = false;
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const next = data.items || [];
        setItems(next.length > 0 ? next : fallback);
      })
      .catch(() => {
        if (!cancelled) setItems(fallback);
      });
    return () => {
      cancelled = true;
    };
  }, [useDatabase, fallback]);

  const visible = items.filter(
    (item) => active === "All" || item.category === active,
  );

  return (
    <section
      id={sectionId || "gallery"}
      className={`msco-gallery ${template === "authority" ? "msco-gallery--authority" : ""}`}
    >
      <div className="msco-section-head">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="msco-gallery__tabs" role="tablist">
        {categoryList.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={active === cat}
            className={active === cat ? "is-active" : ""}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="msco-gallery__grid">
        {visible.map((item) => (
          <button
            key={item.id}
            type="button"
            className="msco-gallery__item"
            onClick={() => setLightbox(item)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.label || "Gallery image"} />
            <span>
              <strong>{item.label}</strong>
              <em>{item.description}</em>
            </span>
          </button>
        ))}
        {visible.length === 0 ? (
          <p className="msco-gallery__empty">
            No gallery images in this category yet.
          </p>
        ) : null}
      </div>
      {lightbox ? (
        <div
          className="msco-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.src} alt={lightbox.label || ""} />
          <p>
            {lightbox.label}
            {lightbox.description ? ` — ${lightbox.description}` : ""}
          </p>
        </div>
      ) : null}
    </section>
  );
}
