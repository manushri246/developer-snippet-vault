import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  // Auto-prepend https:// if domain was provided without protocol
  if (
    supabaseUrl &&
    !supabaseUrl.startsWith("http://") &&
    !supabaseUrl.startsWith("https://")
  ) {
    supabaseUrl = `https://${supabaseUrl}`;
  }

  // If Supabase credentials are not configured or invalid, allow navigation gracefully
  if (!supabaseUrl || !supabaseUrl.startsWith("http") || !supabaseKey) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // IMPORTANT: Avoid using getSession() on server to prevent caching issues.
    // getUser() validates the JWT with the Supabase Auth server.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Protected routes: unauthenticated users cannot access dashboard or snippets
    const isProtectedRoute =
      pathname.startsWith("/dashboard") || pathname.startsWith("/snippets");

    // Auth routes: authenticated users should be redirected to dashboard
    const isAuthRoute =
      pathname === "/login" || pathname === "/signup";

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(url);
    }

    if (user && isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.warn("Supabase session update skipped:", err);
  }

  return supabaseResponse;
}
