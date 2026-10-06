/** Build a mailto that opens Michael's mail app with a ready-to-send reply. */
export function inquiryMailto(inquiry: {
  name: string;
  email: string;
  message: string;
}) {
  const subject = `Re: Your MCSO Security Group inquiry`;
  const body = [
    `Hi ${inquiry.name},`,
    "",
    "Thank you for contacting MCSO Security Group. I'm following up on your message:",
    "",
    `“${inquiry.message.trim()}”`,
    "",
    "Best regards,",
    "MCSO Security Group",
  ].join("\n");

  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${inquiry.email}?${params.toString()}`;
}
