"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const LOADING_TEXTS = [
  "Thinking...",
  "Translating...",
  "Generating command...",
];

interface AILoaderProps {
  className?: string;
  interval?: number;
}

export function AILoader({ className, interval = 1800 }: AILoaderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div
      className={cn("flex items-center justify-center py-4", className)}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={cn(
            "text-sm font-medium bg-gradient-to-r from-foreground via-muted-foreground to-foreground",
            "bg-[length:200%_100%] bg-clip-text text-transparent",
            "animate-[shimmer_2s_linear_infinite]"
          )}
        >
          {LOADING_TEXTS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
