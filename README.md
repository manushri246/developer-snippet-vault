# Developer Snippet Vault & AI Publisher

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR%20%26%20RLS-3ecf8e?logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-3.8%20Flash-orange?logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

A modern, full-stack developer productivity platform engineered to store, organize, and auto-summarize code snippets. Powered by **Next.js 16 App Router**, **Supabase PostgreSQL with Row Level Security (RLS)**, and Google's official **Gemini 3.8 Flash SDK (`@google/genai`)** for automatic plain-English explanations and smart technical tag generation through the Interactions API.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Environment Setup](#environment-setup)
- [Database Setup & Security (Supabase)](#database-setup--security-supabase)
- [Local Development](#local-development)
- [Gemini AI Configuration & Fallback Safety](#gemini-ai-configuration--fallback-safety)
- [Deployment Guide (GitHub & Vercel)](#deployment-guide-github--vercel)
- [Interview Defense & Project Highlights](#interview-defense--project-highlights)
- [Known Limitations](#known-limitations)

---

## Project Overview
Developers repeatedly solve similar algorithmic problems, create database configurations, or construct API clients across different repositories. **Developer Snippet Vault** provides an encrypted, authenticated personal vault where:
1. Snippets are securely isolated per user via PostgreSQL Row Level Security.
2. Saving code automatically triggers a server-side Gemini 3.8 Flash prompt that yields:
   - Exactly **one clear, plain-English sentence** explaining what the code does.
   - **3 to 5 lowercase technical tags** (e.g., `#typescript`, `#authentication`, `#nextjs`).
3. The interface features a dark developer-focused theme, Prism syntax highlighting with 1-click clipboard copying, live search, and multi-parameter filtering.

---

## Key Features

- **Developer Dashboard**: High-contrast dark theme with metrics on total snippets, distinct languages, and AI summaries.
- **Full Snippet CRUD**: Create, read, edit, and delete snippets with an accessible confirmation safety modal.
- **Live Search & Filters**: Client-side filtering by snippet title, code content, programming language, or technical tag pills.
- **AI Auto-Publisher**: Server-only Google GenAI SDK integration (`@google/genai`) producing structured JSON summaries.
- **On-Demand AI Regeneration**: Re-analyze existing code whenever updates are made.
- **Zero-Loss Graceful Fallback**: If the Gemini API key is unset or rate-limited, code is safely preserved with heuristic tags and an inline retry option.
- **Code Editor Ergonomics**: Monospace editor supporting Tab-key indentation (2 spaces), line counts, and character limit indicators.
- **Syntax Highlighting & 1-Click Copy**: Prism-powered syntax highlighting (`vscDarkPlus` theme) with instant clipboard feedback.
- **Strict Authorization**: User ID is verified and assigned server-side from Supabase auth cookies. URL tampering cannot expose other users' snippets.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js App Router | 16.4.0 | Server components, Server Actions, Next.js 16 Proxy |
| **Frontend** | React | 19.3.0 | Modern UI primitives with `useActionState` |
| **Language** | TypeScript | 5.x | Strict end-to-end type safety |
| **Styling** | Tailwind CSS | v4 | Modern styling tokens and dark aesthetic |
| **Database** | Supabase (PostgreSQL) | Latest | Relational database with Row Level Security |
| **Auth** | Supabase SSR (`@supabase/ssr`) | 0.12.7 | Cookie-based session validation & Proxy |
| **AI Engine** | Google GenAI SDK (`@google/genai`) | 2.28.0 | Server-side Gemini 3.8 Flash structured generation via Interactions API |
| **Syntax Highlighting** | `react-syntax-highlighter` | 16.1.2 | Prism developer theme with line numbers |
| **Icons** | `lucide-react` | 1.55.0 | Clean developer iconography |

---

## System Architecture

```text
[ Browser / Client ]
        │
        ▼ (HTTPS Request)
[ Next.js 16 Proxy (proxy.ts) ] ─── Validates session cookie with Supabase Auth
        │
        ├── Unauthenticated & Protected Route -> Redirect to /login
        └── Authenticated -> Forwards to App Router
                │
                ├── / (Landing Page) ──────── Static Shell + Live Demo
                ├── /login & /signup ──────── Supabase SSR Auth Actions
                ├── /dashboard ────────────── Dynamic Authenticated Data Fetching
                ├── /snippets/new ─────────── Server Action: createSnippet()
                │                                    │
                │                                    ├── 1. Verify User from Cookie
                │                                    ├── 2. Validate Inputs
                │                                    ├── 3. Call Google Gemini SDK
                │                                    └── 4. Insert into Supabase (RLS)
                └── /snippets/[id] ────────── Scoped Query (user_id = auth.uid())
```

---

## Environment Setup

Create `.env.local` in your project root using `.env.example` as a template:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
# (Optional alias if your dashboard labels it anon key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Gemini AI Configuration
# Get your free key at: https://aistudio.google.com/
GEMINI_API_KEY=your-gemini-api-key

# Optional: Gemini model (default: gemini-3.8-flash)
GEMINI_MODEL=gemini-3.8-flash
```

> **Security Note:** `.env.local` is listed in `.gitignore` and must **never** be committed to Git. Secret keys and `GEMINI_API_KEY` are kept strictly on the server and are never exposed to browser bundles.

---

## Database Setup & Security (Supabase)

The database schema and policies are preserved in `supabase/schema.sql`.

### 1. Table Definition (`public.snippets`)
```sql
CREATE TABLE IF NOT EXISTS public.snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  summary TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### 2. Row Level Security (RLS) Policies
```sql
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own snippets"
  ON public.snippets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own snippets"
  ON public.snippets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets"
  ON public.snippets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets"
  ON public.snippets FOR DELETE
  USING (auth.uid() = user_id);
```

---

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run lint and type checks:**
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

3. **Build the production bundle:**
   ```bash
   npm run build
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Gemini AI Configuration & Fallback Safety

The AI Publisher module is located in `lib/gemini.ts`.
- **SDK:** Google's official `@google/genai` library.
- **Model:** `gemini-3.8-flash` through the Interactions API (configurable through `GEMINI_MODEL`).
- **Privacy:** Interaction storage is disabled so submitted source code is not retained as Interaction history.
- **Prompt Isolation:** User code is treated as untrusted data input. Prompts explicitly constrain the output format to JSON.
- **Zero Data Loss:** If the Gemini API key is missing or encounters a timeout/quota limit, the application does not fail. It creates the snippet with a safe heuristic summary (e.g., `A TypeScript implementation for "auth handler"`) and default language tags. Users can click **"Regenerate AI Analysis"** at any point once keys or connectivity are active.

---

## Deployment Guide (GitHub & Vercel)

### Step 1: Push to GitHub
1. Initialize or stage your files:
   ```bash
   git add .
   git commit -m "Complete Developer Snippet Vault & AI Publisher"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Connect and push:
   ```bash
   git remote add origin https://github.com/<your-username>/developer-snippet-vault.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel
1. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
2. Select your `developer-snippet-vault` GitHub repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable key
   - `GEMINI_API_KEY` = your Gemini API key
   - `GEMINI_MODEL` = `gemini-3.8-flash`
4. Click **Deploy**. Vercel will automatically run `npm run build` and output a live production URL.

### Step 3: Configure Supabase Authentication URLs
1. In your **Supabase Dashboard**, navigate to **Authentication -> URL Configuration**.
2. Set **Site URL** to your Vercel deployment URL (e.g., `https://developer-snippet-vault.vercel.app`).
3. In **Redirect URLs**, add:
   - `https://developer-snippet-vault.vercel.app/**`
   - `http://localhost:3000/**` (for local testing)

---

## Interview Defense & Project Highlights

When presenting this project in an internship interview, highlight these technical decisions:

1. **Next.js 16 Proxy Convention Migration:**
   - Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`. We implemented `proxy.ts` using `updateSession()` from `@supabase/ssr` to ensure server-side auth cookie refreshes.
2. **PostgreSQL Row Level Security (RLS) vs. Application Logic:**
   - Explain that data isolation isn't just an application-level `WHERE user_id = ...` filter. The database itself rejects unauthorized queries even if malicious requests bypass server code.
3. **Resilient AI Pipeline:**
   - Explain why you designed Gemini integration with structured JSON schemas and offline fallbacks: code persistence must never depend on external AI uptime.
4. **Turbopack Workspace Root Resolution:**
   - Resolved multi-lockfile Turbopack warning by explicitly declaring `turbopack: { root: path.resolve(".") }` in `next.config.ts`.

---

## Known Limitations
- Email confirmation depends on Supabase project email quotas (default rate limit of 3 emails/hour on free tier; disable email confirmation in Supabase Auth settings for instant local signup testing).
- Gemini free tier has rate limits of 15 requests per minute (RPM).
