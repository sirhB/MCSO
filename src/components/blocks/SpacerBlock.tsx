"use client";

type Props = { size: "sm" | "md" | "lg" };

const heights = { sm: 40, md: 80, lg: 140 };

export function SpacerBlock({ size }: Props) {
  return (
    <div
      className="msco-spacer"
      style={{ height: heights[size] || 80 }}
      aria-hidden
    />
  );
}
