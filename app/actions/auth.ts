"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateAuthInput } from "@/lib/validation";

export type AuthState = {
  error: string | null;
  message: string | null;
  success?: boolean;
};

export async function signIn(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const validation = validateAuthInput(email, password);
  if (!validation.success || !validation.data) {
    return { error: validation.error || "Invalid input", message: null };
  }

  const supabase = await createClient();

  // Check if Supabase keys are configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    return {
      error: "Supabase credentials are not configured yet. Please configure your .env.local file with your Supabase project keys.",
      message: null,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return { error: error.message, message: null };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const validation = validateAuthInput(email, password);
  if (!validation.success || !validation.data) {
    return { error: validation.error || "Invalid input", message: null };
  }

  const supabase = await createClient();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
    return {
      error: "Supabase credentials are not configured yet. Please configure your .env.local file with your Supabase project keys.",
      message: null,
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return { error: error.message, message: null };
  }

  // If email confirmation is required by Supabase project
  if (data?.user && !data.session) {
    return {
      error: null,
      message:
        "Account created! Please check your email inbox to verify your email address before logging in.",
      success: true,
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
