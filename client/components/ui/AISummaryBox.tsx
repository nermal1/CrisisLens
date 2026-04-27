"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AISummaryBoxProps {
  type: "lstm" | "news" | "scenario";
  data: Record<string, unknown> | null;
  disabled?: boolean;
}

const LABELS: Record<string, string> = {
  lstm: "LSTM Results",
  news: "News Sentiment",
  scenario: "Scenario Results",
};

export default function AISummaryBox({ type, data, disabled }: AISummaryBoxProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSummarize() {
    if (!data) return;
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://crisislens.onrender.com";
      const res = await fetch(`${API_URL}/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });

      if (!res.ok) throw new Error("Failed to generate summary.");
      const json = await res.json();
      setSummary(json.summary);
    } catch {
      setError("Could not generate summary. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-green-500" />
          <span className="text-sm font-semibold text-slate-700">AI Summary</span>
        </div>
        <Button
          onClick={handleSummarize}
          disabled={disabled || loading || !data}
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-xl"
        >
          {loading ? (
            <><Loader2 size={14} className="animate-spin mr-2" /> Generating...</>
          ) : (
            <><Sparkles size={14} className="mr-2" /> Summarize {LABELS[type]}</>
          )}
        </Button>
      </div>

      {summary && (
        <p className="text-sm text-slate-700 leading-relaxed border-t pt-4">
          {summary}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 border-t pt-4">{error}</p>
      )}

      {!summary && !error && !loading && (
        <p className="text-xs text-slate-400">
          Click the button above to generate a plain-English explanation of these results.
        </p>
      )}
    </div>
  );
}
