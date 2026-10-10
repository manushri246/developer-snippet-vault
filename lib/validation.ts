export const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "sql",
  "json",
  "bash",
  "rust",
  "go",
  "java",
  "csharp",
  "cpp",
  "php",
  "ruby",
  "yaml",
  "markdown",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export interface SnippetInput {
  title: string;
  code: string;
  language: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateSnippetInput(input: {
  title?: unknown;
  code?: unknown;
  language?: unknown;
}): ValidationResult<SnippetInput> {
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const code = typeof input.code === "string" ? input.code.trim() : "";
  const language =
    typeof input.language === "string"
      ? input.language.trim().toLowerCase()
      : "javascript";

  if (!title) {
    return { success: false, error: "Title is required (maximum 150 characters)." };
  }
  if (title.length > 150) {
    return { success: false, error: "Title cannot exceed 150 characters." };
  }

  if (!code) {
    return { success: false, error: "Code content cannot be empty." };
  }
  if (code.length > 50000) {
    return { success: false, error: "Code content exceeds maximum allowed length (50,000 characters)." };
  }

  if (!language) {
    return { success: false, error: "Programming language is required." };
  }

  return {
    success: true,
    data: {
      title,
      code,
      language,
    },
  };
}

export function validateAuthInput(email?: unknown, password?: unknown) {
  if (typeof email !== "string" || !email.includes("@") || email.length < 5) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (typeof password !== "string" || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }
  return {
    success: true,
    data: { email: email.trim().toLowerCase(), password },
  };
}
