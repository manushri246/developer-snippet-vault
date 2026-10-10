"use client";

import { Search, X, Filter } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  availableLanguages: string[];
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  availableLanguages,
}: SearchBarProps) {
  const hasActiveFilters = searchQuery !== "" || selectedLanguage !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, code, tag, or summary..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-zinc-500 transition-colors outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            type="button"
            className="absolute right-3 top-3 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Language Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 focus:border-emerald-500 text-sm text-zinc-200 outline-none cursor-pointer transition-colors"
          >
            <option value="all">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          <Filter className="pointer-events-none absolute left-3 top-3 w-4 h-4 text-zinc-400" />
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange("");
              onLanguageChange("all");
            }}
            type="button"
            className="px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
