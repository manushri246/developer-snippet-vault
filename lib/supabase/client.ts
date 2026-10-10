import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  if (
    supabaseUrl &&
    !supabaseUrl.startsWith("http://") &&
    !supabaseUrl.startsWith("https://")
  ) {
    supabaseUrl = `https://${supabaseUrl}`;
  }

  // Fallback to placeholder valid URL if unset to prevent client-side initialization crash
  const validUrl = supabaseUrl || "https://placeholder.supabase.co";
  const validKey = supabaseKey || "placeholder-key";

  return createBrowserClient<Database>(validUrl, validKey);
}
