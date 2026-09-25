export const INQUIRY_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTED",
  "WON",
  "LOST",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const STATUS_LABELS: Record<InquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  QUOTED: "Quoted",
  WON: "Won",
  LOST: "Lost",
};

export const STATUS_COLORS: Record<InquiryStatus, string> = {
  NEW: "#3b82f6",
  CONTACTED: "#8b5cf6",
  QUALIFIED: "#06b6d4",
  QUOTED: "#e5c158",
  WON: "#22c55e",
  LOST: "#94a3b8",
};

/** Happy-path pipeline used by the admin flowchart */
export const PIPELINE_FLOW: InquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTED",
  "WON",
];
