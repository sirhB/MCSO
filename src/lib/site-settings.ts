import { prisma } from "@/lib/prisma";
import {
  DEFAULT_REPLY_PHRASES,
  REPLY_INTRO_KEY,
  REPLY_SIGN_OFF_KEY,
  REPLY_SUBJECT_KEY,
  type ReplyPhrases,
} from "@/lib/reply-phrases";

export type { ReplyPhrases };
export { DEFAULT_REPLY_PHRASES };

async function readSetting(key: string): Promise<string | null> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function getReplyPhrases(): Promise<ReplyPhrases> {
  const [subject, intro, signOff] = await Promise.all([
    readSetting(REPLY_SUBJECT_KEY),
    readSetting(REPLY_INTRO_KEY),
    readSetting(REPLY_SIGN_OFF_KEY),
  ]);

  return {
    subject: subject?.trim() || DEFAULT_REPLY_PHRASES.subject,
    intro: intro?.trim() || DEFAULT_REPLY_PHRASES.intro,
    signOff: signOff?.trim() || DEFAULT_REPLY_PHRASES.signOff,
  };
}

export async function setReplyPhrases(phrases: ReplyPhrases) {
  const rows: { key: string; value: string }[] = [
    { key: REPLY_SUBJECT_KEY, value: phrases.subject.trim() },
    { key: REPLY_INTRO_KEY, value: phrases.intro.trim() },
    { key: REPLY_SIGN_OFF_KEY, value: phrases.signOff.trim() },
  ];

  for (const row of rows) {
    await prisma.siteSetting.upsert({
      where: { key: row.key },
      update: { value: row.value },
      create: { key: row.key, value: row.value },
    });
  }
}
