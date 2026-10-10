import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createSnippet } from "@/app/actions/snippets";
import { SnippetForm } from "@/components/SnippetForm";
import { Code2, Sparkles } from "lucide-react";

export const instant = false;

export default async function NewSnippetPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-1.5 border-b border-zinc-800 pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
          <Code2 className="w-3.5 h-3.5" />
          <span>vault / new</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
          <span>Create New Snippet</span>
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Add a code snippet to your vault. Gemini AI will automatically generate a plain-English explanation and tag index upon saving.
        </p>
      </div>

      {/* Snippet Form */}
      <SnippetForm formAction={createSnippet} />
    </div>
  );
}
