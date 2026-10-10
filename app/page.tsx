import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import {
  Code2,
  Sparkles,
  ShieldCheck,
  Search,
  Zap,
  ArrowRight,
  Cpu,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const demoCode = `// Authenticate and protect API routes with Supabase SSR
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized access");
  return user;
}`;

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-60"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Release Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 shadow-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Next.js 16</span>
            <span className="text-zinc-600">•</span>
            <span>Supabase SSR</span>
            <span className="text-zinc-600">•</span>
            <span className="text-emerald-400 font-medium">Gemini 3.8 Flash</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Developer Snippet Vault <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              &amp; AI Publisher
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            A production-ready vault for your algorithms, database queries, and utilities. Powered by server-side Gemini AI for automatic plain-English explanations and smart tag indexing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Open Your Vault</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <Link
              href="/signup"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-zinc-900 hover:bg-zinc-800/90 text-zinc-200 border border-zinc-800 transition-all hover:border-zinc-700 cursor-pointer"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Snippet Preview */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="relative rounded-2xl p-1 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 shadow-2xl">
            <div className="rounded-xl bg-zinc-950 p-4 sm:p-6 space-y-4">
              {/* Preview Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Next.js Supabase Auth Cookie Helper
                    </h2>
                    <span className="text-xs text-zinc-500">Live Vault Snippet Preview</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                    #supabase
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                    #authentication
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                    #nextjs
                  </span>
                </div>
              </div>

              {/* AI Publisher Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-zinc-300 leading-relaxed flex items-start space-x-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-400 mr-1.5">
                    Gemini 3.8 Flash Summary:
                  </span>
                  <span>
                    Initializes a server-side Supabase client using asynchronous Next.js cookies to securely fetch and validate the authenticated user.
                  </span>
                </div>
              </div>

              {/* Code block with syntax highlighting */}
              <CodeBlock code={demoCode} language="typescript" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="border-t border-zinc-900 bg-zinc-950/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Built for Modern Software Engineering
            </h2>
            <p className="text-sm text-zinc-400">
              Every feature designed with developer security, speed, and real production standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3.5 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Row Level Security (RLS)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Supabase Postgres RLS policies ensure that users can only ever select, insert, update, or delete their own snippets. Even tampering with URLs cannot expose other users&apos; data.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3.5 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Gemini 3.8 AI Publisher
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Uses the official @google/genai SDK on the server to distill code into 1-sentence explanations and 3–5 technical tags with structured JSON and fallback safety.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3.5 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/50 flex items-center justify-center text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Next.js 16 SSR &amp; Actions
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Leverages Next.js App Router server actions and async cookies for frictionless authentication session management without exposing secrets in the browser.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3.5 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/50 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Developer Monospace Editor
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clean text editor with tab indentation support, live line count, character counters, and Prism syntax highlighting with 1-click clipboard copying.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3.5 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800/50 flex items-center justify-center text-rose-400">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Real-Time Search &amp; Filter
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Search through snippets instantly by title, code content, AI summary, or tag badges. Filter down by programming language with instant feedback.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3.5 hover:border-zinc-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/50 flex items-center justify-center text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Vercel Ready Deployment
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Clean architecture with zero client-side leaks, Turbopack compatibility, strict TypeScript checks, and clear environment templates for 1-click cloud deploy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
