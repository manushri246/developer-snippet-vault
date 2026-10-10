"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { SUPPORTED_LANGUAGES } from "@/lib/validation";
import type { SnippetActionState } from "@/app/actions/snippets";
import {
  Sparkles,
  Code2,
  AlertCircle,
  Loader2,
  FileCode,
  ArrowLeft,
  Save,
} from "lucide-react";

interface SnippetFormProps {
  initialData?: {
    id?: string;
    title?: string;
    language?: string;
    code?: string;
  };
  formAction: (
    prevState: SnippetActionState | null,
    formData: FormData
  ) => Promise<SnippetActionState>;
  isEditing?: boolean;
}

export function SnippetForm({
  initialData,
  formAction,
  isEditing = false,
}: SnippetFormProps) {
  const [state, action, isPending] = useActionState(formAction, null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [language, setLanguage] = useState(
    initialData?.language || "typescript"
  );
  const [code, setCode] = useState(initialData?.code || "");

  // Allow Tab key to indent inside the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const updatedCode =
        code.substring(0, start) + "  " + code.substring(end);
      setCode(updatedCode);

      // Restore cursor position after state update
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lineCount = code ? code.split("\n").length : 1;

  return (
    <form action={action} className="space-y-6">
      {/* Error Banner */}
      {state?.error && (
        <div className="flex items-start space-x-3 p-4 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold block mb-0.5">Validation Error</span>
            {state.error}
          </div>
        </div>
      )}

      {/* Metadata Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title */}
        <div className="md:col-span-2 space-y-1.5">
          <label
            htmlFor="title"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
          >
            Snippet Title <span className="text-emerald-400">*</span>
          </label>
          <div className="relative">
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js Supabase Auth Middleware Handler"
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-zinc-500 px-4 py-2.5 text-sm transition-colors outline-none"
            />
            <span className="absolute right-3 top-2.5 text-[11px] text-zinc-500 font-mono">
              {title.length}/150
            </span>
          </div>
        </div>

        {/* Language Selector */}
        <div className="space-y-1.5">
          <label
            htmlFor="language"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
          >
            Programming Language <span className="text-emerald-400">*</span>
          </label>
          <div className="relative">
            <select
              id="language"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white px-4 py-2.5 text-sm appearance-none transition-colors outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-zinc-900 text-white">
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-3 text-zinc-400">
              <Code2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="code"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>Code Content</span>
            <span className="text-emerald-400">*</span>
          </label>
          <div className="flex items-center space-x-3 text-xs text-zinc-400 font-mono">
            <span>{lineCount} {lineCount === 1 ? "line" : "lines"}</span>
            <span>{code.length} chars</span>
          </div>
        </div>

        <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl focus-within:border-emerald-500/80 transition-colors">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/60 text-xs text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block"></span>
              <span className="font-mono text-zinc-300">{language}</span>
            </div>
            <span className="text-[11px] text-zinc-500">
              Press Tab to indent (2 spaces)
            </span>
          </div>

          <textarea
            id="code"
            name="code"
            required
            rows={16}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="// Paste or write your snippet here..."
            className="w-full bg-transparent p-4 font-mono text-sm text-zinc-100 placeholder-zinc-600 outline-none resize-y leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {/* AI Publisher Notice */}
      <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/30 text-emerald-300 text-xs">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>{isEditing ? "AI Analysis:" : "AI Auto-Publisher:"}</strong>{" "}
          {isEditing
            ? "Saving changes will refresh the plain-English summary and tags."
            : "Gemini will generate a plain-English explanation and tags when you save."}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <Link
          href={isEditing && initialData?.id ? `/snippets/${initialData.id}` : "/dashboard"}
          className="flex items-center space-x-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </Link>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEditing ? "Saving Changes..." : "Analyzing & Saving..."}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Update Snippet" : "Save Snippet"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
