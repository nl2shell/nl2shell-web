"use client";

import { useCallback, useState } from "react";

interface TranslateResult {
  command: string;
  meta: string;
}

interface TranslateState {
  result: TranslateResult | null;
  isLoading: boolean;
  error: string | null;
}

export function useTranslate() {
  const [state, setState] = useState<TranslateState>({
    result: null,
    isLoading: false,
    error: null,
  });

  const translate = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setState({ result: null, isLoading: true, error: null });

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState({
          result: null,
          isLoading: false,
          error: data.error || "Translation failed",
        });
        return;
      }

      setState({
        result: { command: data.command, meta: data.meta },
        isLoading: false,
        error: null,
      });
    } catch {
      setState({
        result: null,
        isLoading: false,
        error: "Network error. Please check your connection.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ result: null, isLoading: false, error: null });
  }, []);

  return { ...state, translate, reset };
}
