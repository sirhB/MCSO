import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { scheduleBackup } from "@/lib/backup";
import { DEFAULT_REPLY_PHRASES } from "@/lib/reply-phrases";
import { getReplyPhrases, setReplyPhrases } from "@/lib/site-settings";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const replyPhrases = await getReplyPhrases();
  return NextResponse.json({ replyPhrases, defaults: DEFAULT_REPLY_PHRASES });
}

const patchSchema = z.object({
  replyPhrases: z.object({
    subject: z.string().min(1).max(200),
    intro: z.string().min(1).max(2000),
    signOff: z.string().min(1).max(500),
  }),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = patchSchema.parse(await req.json());
    await setReplyPhrases(body.replyPhrases);
    scheduleBackup();
    const replyPhrases = await getReplyPhrases();
    return NextResponse.json({ ok: true, replyPhrases });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || "Invalid settings." },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Could not save settings." },
      { status: 500 },
    );
  }
}
