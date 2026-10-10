"use client";

import { useState } from "react";
import { regenerateAISummary } from "@/app/actions/snippets";
import { Sparkles, Loader2, Check, AlertCircle } from "lucide-react";

interface RegenerateAIButtonProps {
  snippetId: string;
}

export function RegenerateAIButton({ snippetId }: RegenerateAIButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleRegenerate = async () => {
    setIsPending(true);
    setFeedback(null);

    try {
      const result = await regenerateAISummary(snippetId);
      if (result.error) {
        setFeedback({ type: "error", message: result.error });
      } else {
        setFeedback({
          type: "success",
          message: result.message || "Summary regenerated!",
        });
        setTimeout(() => setFeedback(null), 4000);
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to regenerate",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleRegenerate}
        disabled={isPending}
        type="button"
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 transition-all shadow-sm cursor-pointer disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>Regenerating with Gemini...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Regenerate AI Analysis</span>
          </>
        )}
      </button>

      {feedback && (
        <div
          className={`flex items-center space-x-1.5 text-xs p-2 rounded-lg ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border border-emerald-800/40 text-emerald-300"
              : "bg-red-950/40 border border-red-800/40 text-red-300"
          }`}
        >
          {feedback.type === "success" ? (
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
}
