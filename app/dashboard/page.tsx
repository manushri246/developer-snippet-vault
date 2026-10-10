import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SnippetList } from "@/components/SnippetList";
import type { Snippet } from "@/lib/supabase/types";
import {
  Plus,
  Code2,
  Sparkles,
  Layers,
  Terminal,
} from "lucide-react";

export const instant = false;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch snippets strictly scoped to user.id
  const { data: snippets, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching snippets from Supabase:", error);
  }

  const snippetList: Snippet[] = snippets || [];

  // Compute summary metrics
  const totalSnippets = snippetList.length;
  const languagesCount = new Set(snippetList.map((s) => s.language.toLowerCase()))
    .size;
  const aiSummarizedCount = snippetList.filter((s) => Boolean(s.summary)).length;

  const userDisplayName = user.email ? user.email.split("@")[0] : "Developer";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>developer-snippet-vault / workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, <span className="text-emerald-400">{userDisplayName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Manage your personal code vault and AI-published snippets
          </p>
        </div>

        <div>
          <Link
            href="/snippets/new"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Snippet</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4.5 flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold block">
              Total Snippets
            </span>
            <span className="text-2xl font-bold text-white font-mono">
              {totalSnippets}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4.5 flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center text-cyan-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold block">
              Languages
            </span>
            <span className="text-2xl font-bold text-white font-mono">
              {languagesCount}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4.5 flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold block">
              AI Summaries
            </span>
            <span className="text-2xl font-bold text-white font-mono">
              {aiSummarizedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Snippet List (Search, Filter, Cards) */}
      <SnippetList initialSnippets={snippetList} />
    </div>
  );
}
