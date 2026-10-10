"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/actions/auth";
import {
  Code2,
  Plus,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  initialUserEmail?: string | null;
}

export function Navbar({ initialUserEmail }: NavbarProps) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string | null>(
    initialUserEmail || null
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();

      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) {
          setUserEmail(user.email);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserEmail(session?.user?.email || null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      // Graceful fallback if client environment keys are not configured yet
    }
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-2.5 group transition-transform hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <Code2 className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Snippet<span className="text-emerald-400">Vault</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-300">
                  <Sparkles className="w-2.5 h-2.5 inline mr-0.5" /> AI Powered
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {userEmail ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/dashboard")
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/snippets/new"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>New Snippet</span>
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-400 hover:text-white px-3 py-2"
              >
                Features
              </Link>
            )}
          </nav>

          {/* User Auth Info (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {userEmail ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg max-w-[220px] truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">{userEmail}</span>
                </div>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-red-400 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="flex items-center space-x-1.5 text-sm font-medium text-zinc-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-zinc-900 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center space-x-1.5 text-sm font-semibold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-500/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/95 px-4 pt-2 pb-4 space-y-3">
          {userEmail ? (
            <>
              <div className="text-xs text-zinc-400 px-2 py-1">
                Signed in as <span className="text-zinc-200">{userEmail}</span>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-900"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/snippets/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-900/50"
              >
                <Plus className="w-4 h-4" />
                <span>New Snippet</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-zinc-900 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-sm font-medium text-zinc-300 hover:text-white py-2 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-sm font-semibold text-zinc-950 bg-emerald-500 hover:bg-emerald-400 py-2 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
