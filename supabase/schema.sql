-- ==============================================================================
-- Developer Snippet Vault & AI Publisher - Supabase Database Schema Reference
-- ==============================================================================
-- NOTE: If you already ran this in your Supabase SQL Editor, you do NOT need
-- to re-run it. This file serves as documentation and reference.
-- ==============================================================================

-- 1. Create the snippets table
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

-- 3. Policy: View Own Snippets
CREATE POLICY "Users can view their own snippets"
  ON public.snippets
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Policy: Insert Own Snippets
CREATE POLICY "Users can insert their own snippets"
  ON public.snippets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Update Own Snippets
CREATE POLICY "Users can update their own snippets"
  ON public.snippets
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Policy: Delete Own Snippets
CREATE POLICY "Users can delete their own snippets"
  ON public.snippets
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- Verification Queries (Run in Supabase SQL Editor to verify status)
-- ==============================================================================
-- Verify table exists and check columns:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'snippets';

-- Verify RLS is enabled:
-- SELECT relname, relrowsecurity
-- FROM pg_class
-- WHERE relname = 'snippets';

-- Verify RLS policies:
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'snippets';
