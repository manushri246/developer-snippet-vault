import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateSnippet } from "@/app/actions/snippets";
import { SnippetForm } from "@/components/SnippetForm";
import type { Snippet } from "@/lib/supabase/types";
import { Code2, Edit } from "lucide-react";

export const instant = false;

interface EditSnippetPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSnippetPage({
  params,
}: EditSnippetPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Strictly enforce user_id match to prevent editing other users' snippets
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
  const boundUpdateAction = updateSnippet.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-1.5 border-b border-zinc-800 pb-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
          <Code2 className="w-3.5 h-3.5" />
          <span>vault / edit / {id.slice(0, 8)}...</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
          <span>Edit Snippet</span>
          <Edit className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Update the title, programming language, or code content of your snippet.
        </p>
      </div>

      {/* Snippet Edit Form */}
      <SnippetForm
        initialData={{
          id: typedSnippet.id,
          title: typedSnippet.title,
          language: typedSnippet.language,
          code: typedSnippet.code,
        }}
        formAction={boundUpdateAction}
        isEditing={true}
      />
    </div>
  );
}
