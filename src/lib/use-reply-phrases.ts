"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_REPLY_PHRASES,
  type ReplyPhrases,
} from "@/lib/reply-phrases";

/** Load editable reply phrases for mailto links in client admin pages. */
export function useReplyPhrases() {
  const [phrases, setPhrases] = useState<ReplyPhrases>(DEFAULT_REPLY_PHRASES);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data.replyPhrases) return;
        setPhrases(data.replyPhrases);
      })
      .catch(() => {
        // Keep defaults if settings cannot load.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return phrases;
}
