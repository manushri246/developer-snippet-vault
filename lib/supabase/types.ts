export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Snippet = {
  id: string;
  user_id: string;
  title: string;
  code: string;
  language: string;
  summary: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      snippets: {
        Row: Snippet;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          code: string;
          language: string;
          summary?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          code?: string;
          language?: string;
          summary?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: {
          foreignKeyName: string;
          columns: string[];
          isOneToOne?: boolean;
          referencedRelation: string;
          referencedColumns: string[];
        }[];
      };
    };
    Views: Record<string, {
      Row: Record<string, unknown>;
      Relationships: [];
    }>;
    Functions: Record<string, {
      Args: Record<string, unknown>;
      Returns: unknown;
    }>;
  };
};
