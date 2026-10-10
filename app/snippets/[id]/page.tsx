import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/lib/supabase/server";
import { CodeBlock } from "@/components/CodeBlock";
import { DeleteButton } from "@/components/DeleteButton";
import { RegenerateAIButton } from "@/components/RegenerateAIButton";
import type { Snippet } from "@/lib/supabase/types";
import {
  ArrowLeft,
  Code2,
  Calendar,
  Sparkles,
  Edit,
  Clock,
} from "lucide-react";

export const instant = false;

interface SnippetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SnippetDetailPage({
  params,
}: SnippetDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Strictly enforce user_id match to prevent ID-tampering across users
  const { data: snippet, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !snippet) {
    notFound();
  }

  const typedSnippet = snippet as Snippet;

  const formattedCreated = new Date(typedSnippet.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const formattedUpdated = typedSnippet.updated_at
    ? new Date(typedSnippet.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-2">
          <Link
            href={`/snippets/${typedSnippet.id}/edit`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>

          <DeleteButton
            snippetId={typedSnippet.id}
            snippetTitle={typedSnippet.title}
          />
        </div>
      </div>

      {/* Snippet Header */}
      <div className="space-y-3 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center space-x-1 text-xs font-mono font-medium text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-2.5 py-1 rounded-md">
            <Code2 className="w-3.5 h-3.5 mr-1" />
            {typedSnippet.language}
          </span>

          <span className="text-xs text-zinc-500 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created {formattedCreated}</span>
          </span>

          {formattedUpdated && formattedUpdated !== formattedCreated && (
            <span className="text-xs text-zinc-500 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated {formattedUpdated}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {typedSnippet.title}
        </h1>
      </div>

      {/* AI Publisher Summary Card */}
      <div className="rounded-2xl border border-emerald-900/60 bg-gradient-to-br from-emerald-950/20 via-zinc-900/60 to-zinc-950 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Gemini AI Summary
            </h2>
          </div>

          <RegenerateAIButton snippetId={typedSnippet.id} />
        </div>

        {typedSnippet.summary ? (
          <p className="text-sm text-zinc-200 leading-relaxed font-sans bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/70">
            {typedSnippet.summary}
          </p>
        ) : (
          <p className="text-sm text-zinc-500 italic">
            No summary generated yet. Click &quot;Regenerate AI Analysis&quot; to analyze with Gemini.
          </p>
        )}

        {/* Tags */}
        {typedSnippet.tags && typedSnippet.tags.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-xs text-zinc-400 block font-medium">
              Taxonomy Tags:
            </span>
            <div className="flex flex-wrap gap-2">
              {typedSnippet.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2.5 py-1 rounded-full shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Code Viewer Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Source Code
        </h2>
        {typedSnippet.language === "markdown" ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm leading-7 text-zinc-200 [&_a]:text-cyan-400 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-400 [&_code]:rounded [&_code]:bg-zinc-900 [&_code]:px-1 [&_code]:font-mono [&_code]:text-emerald-300 [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6">
            <ReactMarkdown>{typedSnippet.code}</ReactMarkdown>
          </div>
        ) : (
          <CodeBlock code={typedSnippet.code} language={typedSnippet.language} />
        )}
      </div>
    </div>
  );
}
