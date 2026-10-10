import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-emerald-400">
          <Code2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            404 - Snippet Not Found
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The snippet you requested does not exist, or you do not have permission to view it under PostgreSQL Row Level Security policies.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
