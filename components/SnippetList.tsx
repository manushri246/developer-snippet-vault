"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Snippet } from "@/lib/supabase/types";
import { SnippetCard } from "./SnippetCard";
import { SearchBar } from "./SearchBar";
import { Plus, Code2, Sparkles, FolderOpen } from "lucide-react";

interface SnippetListProps {
  initialSnippets: Snippet[];
}

export function SnippetList({ initialSnippets }: SnippetListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract distinct languages
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    initialSnippets.forEach((s) => {
      if (s.language) langs.add(s.language.toLowerCase());
    });
    return Array.from(langs).sort();
  }, [initialSnippets]);

  // Extract top tags
  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    initialSnippets.forEach((s) => {
      s.tags?.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [initialSnippets]);

  // Filter snippets based on search, language, and selected tag
  const filteredSnippets = useMemo(() => {
    return initialSnippets.filter((snippet) => {
      // Language filter
      if (
        selectedLanguage !== "all" &&
        snippet.language.toLowerCase() !== selectedLanguage.toLowerCase()
      ) {
        return false;
      }

      // Tag filter
      if (
        selectedTag &&
        (!snippet.tags || !snippet.tags.includes(selectedTag))
      ) {
        return false;
      }

      // Text search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const titleMatch = snippet.title.toLowerCase().includes(query);
        const codeMatch = snippet.code.toLowerCase().includes(query);
        const summaryMatch = snippet.summary?.toLowerCase().includes(query);
        const tagsMatch = snippet.tags?.some((t) =>
          t.toLowerCase().includes(query)
        );

        if (!titleMatch && !codeMatch && !summaryMatch && !tagsMatch) {
          return false;
        }
      }

      return true;
    });
  }, [initialSnippets, searchQuery, selectedLanguage, selectedTag]);

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="space-y-3">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
        />

        {/* Popular Tags Quick Filter Pills */}
        {popularTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-zinc-400">
            <span className="font-medium mr-1 text-zinc-500">Filter by tag:</span>
            {popularTags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(isActive ? null : tag)}
                  className={`px-2.5 py-1 rounded-full font-mono text-xs transition-colors cursor-pointer ${
                    isActive
                      ? "bg-emerald-500 text-zinc-950 font-semibold"
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTag && (
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="text-xs text-zinc-400 hover:text-white underline ml-1 cursor-pointer"
              >
                Clear tag
              </button>
            )}
          </div>
        )}
      </div>

      {/* Snippets Count Indicator */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
        <span>
          Showing{" "}
          <strong className="text-white font-mono">
            {filteredSnippets.length}
          </strong>{" "}
          of{" "}
          <strong className="text-white font-mono">
            {initialSnippets.length}
          </strong>{" "}
          snippets
        </span>

        {(searchQuery || selectedLanguage !== "all" || selectedTag) && (
          <span className="text-emerald-400">Filters applied</span>
        )}
      </div>

      {/* Grid or Empty States */}
      {filteredSnippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      ) : initialSnippets.length === 0 ? (
        /* Zero snippets empty state (First time onboarding) */
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 max-w-2xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
            <Code2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Your vault is empty
            </h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Store your reusable algorithms, database queries, API clients, and configuration snippets. Gemini AI will automatically summarize and tag every snippet you create.
            </p>
          </div>
          <div>
            <Link
              href="/snippets/new"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Your First Snippet</span>
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-4 pt-4 text-xs text-zinc-500">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-summaries</span>
            </span>
            <span>•</span>
            <span>Syntax Highlighting</span>
            <span>•</span>
            <span>1-Click Copy</span>
          </div>
        </div>
      ) : (
        /* Filters returned 0 matches */
        <div className="text-center py-12 px-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 space-y-4">
          <FolderOpen className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-white">
              No matching snippets found
            </h4>
            <p className="text-xs text-zinc-400">
              Try adjusting your search keywords or clearing your filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedLanguage("all");
              setSelectedTag(null);
            }}
            type="button"
            className="px-4 py-2 text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 rounded-lg hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
