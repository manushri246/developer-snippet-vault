"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateSnippetAI } from "@/lib/gemini";
import { validateSnippetInput } from "@/lib/validation";

export type SnippetActionState = {
  error: string | null;
  success?: boolean;
  message?: string | null;
};

export async function createSnippet(
  prevState: SnippetActionState | null,
  formData: FormData
): Promise<SnippetActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawInput = {
    title: formData.get("title"),
    code: formData.get("code"),
    language: formData.get("language"),
  };

  const validation = validateSnippetInput(rawInput);
  if (!validation.success || !validation.data) {
    return {
      error: validation.error || "Please verify your input fields.",
      message: null,
    };
  }

  const { title, code, language } = validation.data;

  // Generate AI summary and tags (resilient with fallback)
  const aiResult = await generateSnippetAI(title, language, code);

  let newSnippetId = "";

  try {
    const { data, error } = await supabase
      .from("snippets")
      .insert({
        user_id: user.id, // Strictly server-assigned user ID
        title,
        code,
        language,
        summary: aiResult.summary,
        tags: aiResult.tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        error: `Database error: ${error.message}`,
        message: null,
      };
    }

    newSnippetId = data.id;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save snippet";
    return {
      error: message,
      message: null,
    };
  }

  revalidatePath("/dashboard");
  redirect(`/snippets/${newSnippetId}`);
}

export async function updateSnippet(
  id: string,
  prevState: SnippetActionState | null,
  formData: FormData
): Promise<SnippetActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawInput = {
    title: formData.get("title"),
    code: formData.get("code"),
    language: formData.get("language"),
  };

  const validation = validateSnippetInput(rawInput);
  if (!validation.success || !validation.data) {
    return {
      error: validation.error || "Please verify your input fields.",
      message: null,
    };
  }

  const { title, code, language } = validation.data;
  const aiResult = await generateSnippetAI(title, language, code);

  try {
    // Update snippet enforcing ownership match user_id === user.id
    const { error } = await supabase
      .from("snippets")
      .update({
        title,
        code,
        language,
        summary: aiResult.summary,
        tags: aiResult.tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return { error: `Database update error: ${error.message}`, message: null };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update snippet";
    return { error: message, message: null };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Strictly enforce user_id match for security
  const { error } = await supabase
    .from("snippets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete snippet: ${error.message}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function regenerateAISummary(id: string): Promise<SnippetActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required.", message: null };
  }

  // Fetch current snippet to ensure ownership and read code
  const { data: snippet, error: fetchError } = await supabase
    .from("snippets")
    .select("id, title, code, language, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !snippet) {
    return {
      error: "Snippet not found or you do not have permission to edit it.",
      message: null,
    };
  }

  const aiResult = await generateSnippetAI(
    snippet.title,
    snippet.language,
    snippet.code
  );

  const { error: updateError } = await supabase
    .from("snippets")
    .update({
      summary: aiResult.summary,
      tags: aiResult.tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    return {
      error: `Failed to update snippet with AI analysis: ${updateError.message}`,
      message: null,
    };
  }

  revalidatePath(`/snippets/${id}`);
  revalidatePath("/dashboard");

  return {
    error: null,
    success: true,
    message: aiResult.success
      ? "AI summary and tags regenerated successfully!"
      : `Updated with fallback (${aiResult.error || "Check GEMINI_API_KEY"})`,
  };
}
