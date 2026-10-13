export type ReplyPhrases = {
  subject: string;
  intro: string;
  signOff: string;
};

export const DEFAULT_REPLY_PHRASES: ReplyPhrases = {
  subject: "Re: Your MCSO Security Group inquiry",
  intro:
    "Thank you for contacting MCSO Security Group. I'm following up on your message:",
  signOff: "Best regards,\nMCSO Security Group",
};

export const REPLY_SUBJECT_KEY = "reply.subject";
export const REPLY_INTRO_KEY = "reply.intro";
export const REPLY_SIGN_OFF_KEY = "reply.signOff";
