import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnippetVault | Developer Snippet Vault & AI Publisher",
  description:
    "Store, organize, and auto-summarize your code snippets with Google Gemini AI and Supabase authentication.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        <Navbar />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-zinc-900 bg-zinc-950/80 py-8 text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-zinc-400">SnippetVault</span>
              <span>•</span>
              <span>Full-Stack Internship Capstone Project</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Next.js 16 App Router</span>
              <span>•</span>
              <span>Supabase SSR & RLS</span>
              <span>•</span>
              <span>Google Gemini 3.8</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
