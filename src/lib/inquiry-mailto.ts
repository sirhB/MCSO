import {
  DEFAULT_REPLY_PHRASES,
  type ReplyPhrases,
} from "@/lib/reply-phrases";

/** Build a mailto that opens Michael's mail app with a ready-to-send reply. */
export function inquiryMailto(
  inquiry: {
    name: string;
    email: string;
    message: string;
  },
  phrases: ReplyPhrases = DEFAULT_REPLY_PHRASES,
) {
  const subject = phrases.subject || DEFAULT_REPLY_PHRASES.subject;
  const intro = phrases.intro || DEFAULT_REPLY_PHRASES.intro;
  const signOff = phrases.signOff || DEFAULT_REPLY_PHRASES.signOff;

  const body = [
    `Hi ${inquiry.name},`,
    "",
    intro,
    "",
    `“${inquiry.message.trim()}”`,
    "",
    signOff,
  ].join("\n");

  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${inquiry.email}?${params.toString()}`;
}
