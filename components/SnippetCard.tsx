"use client";

import Link from "next/link";
import { useState } from "react";
import type { Snippet } from "@/lib/supabase/types";
import {
  Code2,
  Copy,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
  Edit,
} from "lucide-react";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy snippet", err);
    }
  };

  const formattedDate = snippet.created_at
    ? new Date(snippet.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700/80 p-5 shadow-lg shadow-black/20 hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between backdrop-blur-sm">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center space-x-1 text-xs font-mono font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/40 px-2.5 py-1 rounded-md">
            <Code2 className="w-3 h-3 mr-1" />
            {snippet.language}
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              type="button"
              title="Copy code"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-700/80 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <Link
              href={`/snippets/${snippet.id}/edit`}
              title="Edit snippet"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-700/80 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Title */}
        <Link href={`/snippets/${snippet.id}`} className="block group-hover:text-emerald-400 transition-colors">
          <h3 className="text-lg font-semibold text-white tracking-tight line-clamp-1 mb-2">
            {snippet.title}
          </h3>
        </Link>

        {/* AI Summary */}
        {snippet.summary ? (
          <p className="text-xs text-zinc-300/90 leading-relaxed line-clamp-2 mb-3 bg-zinc-950/60 border border-zinc-800/60 rounded-lg p-2.5">
            <Sparkles className="w-3 h-3 text-emerald-400 inline mr-1 -mt-0.5" />
            {snippet.summary}
          </p>
        ) : (
          <p className="text-xs text-zinc-500 italic mb-3">No AI summary generated yet.</p>
        )}

        {/* Tags */}
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {snippet.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono font-medium text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 mt-2">
        <span className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </span>

        <Link
          href={`/snippets/${snippet.id}`}
          className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium group-hover:translate-x-0.5 transition-transform"
        >
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
