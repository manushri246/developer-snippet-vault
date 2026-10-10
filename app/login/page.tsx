"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import {
  Code2,
  LogIn,
  AlertCircle,
  Loader2,
  ArrowRight,
  KeyRound,
  Mail,
} from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Code2 className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sign In to SnippetVault
          </h1>
          <p className="text-xs text-zinc-400">
            Access your secure personal snippet repository
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Error Banner */}
          {state?.error && (
            <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{state.error}</div>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="developer@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                />
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                />
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="pt-4 border-t border-zinc-800/80 text-center text-xs text-zinc-400">
            <span>Don&apos;t have an account yet? </span>
            <Link
              href="/signup"
              className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center space-x-1"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
