import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

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

  // Fallback to placeholder valid URL if unset to prevent server-side crash
  const validUrl = supabaseUrl || "https://placeholder.supabase.co";
  const validKey = supabaseKey || "placeholder-key";

  return createServerClient<Database>(validUrl, validKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
