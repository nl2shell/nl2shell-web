"use client";

import { useState } from "react";

interface FeedbackButtonsProps {
  query: string;
  command: string;
}

type Rating = "up" | "down" | null;

export function FeedbackButtons({ query, command }: FeedbackButtonsProps) {
  const [rating, setRating] = useState<Rating>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = async (value: "up" | "down") => {
    if (submitted) return;

    setRating(value);
    setSubmitted(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, command, rating: value }),
      });
    } catch {
      // Feedback is best-effort — don't block the user
    }
  };

  if (submitted) {
    return (
      <span className="text-[11px] text-muted-foreground/40">
        {rating === "up" ? "Thanks!" : "We'll improve this"}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] text-muted-foreground/30 mr-1">Helpful?</span>
      <button
        onClick={() => handleFeedback("up")}
        className="rounded p-1 text-muted-foreground/30 hover:text-[#2ea44f] hover:bg-[#2ea44f]/10 transition-colors"
        aria-label="Good translation"
      >
        <ThumbsUpIcon className="size-3.5" />
      </button>
      <button
        onClick={() => handleFeedback("down")}
        className="rounded p-1 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors"
        aria-label="Bad translation"
      >
        <ThumbsDownIcon className="size-3.5" />
      </button>
    </div>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function ThumbsDownIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}
