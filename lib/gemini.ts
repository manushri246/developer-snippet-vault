import { GoogleGenAI } from "@google/genai";

export interface AISnippetAnalysis {
  summary: string;
  tags: string[];
  success: boolean;
  error?: string;
}

/**
 * Generate a concise 1-sentence summary and 3-5 tags for a code snippet.
 * Server-only execution. Treats user code as untrusted input.
 */
export async function generateSnippetAI(
  title: string,
  language: string,
  code: string
): Promise<AISnippetAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Smart fallback when Gemini API key is not yet set
  const fallbackSummary = `A ${language || "code"} implementation for "${title || "untitled"}" snippet.`;
  const fallbackTags = [
    (language || "code").toLowerCase(),
    "developer",
    "snippet",
  ];

  if (!apiKey) {
    return {
      summary: fallbackSummary,
      tags: fallbackTags,
      success: false,
      error: "GEMINI_API_KEY is not configured in .env.local",
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

    const prompt = `You are a senior software developer assistant analyzing a code snippet.
Analyze this code and return a valid JSON object with EXACTLY two fields:
1. "summary": Exactly ONE clear, plain-English sentence describing what this code does.
2. "tags": An array of 3 to 5 relevant, concise, lowercase technical tags (e.g., ["typescript", "api", "supabase", "auth"]).

Do NOT include any explanations, markdown code blocks, or text outside the JSON object.

Snippet details:
Title: ${title.slice(0, 200)}
Language: ${language.slice(0, 50)}

Code:
${code.slice(0, 15000)}
`;

    const response = await ai.interactions.create({
      model: modelName,
      input: prompt,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            tags: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 5,
            },
          },
          required: ["summary", "tags"],
          additionalProperties: false,
        },
      },
      store: false,
    });

    const rawText = response.output_text?.trim() || "";

    // Clean potential markdown delimiters if returned
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    if (!cleaned) {
      throw new Error("Empty response returned from Gemini API");
    }

    const parsed = JSON.parse(cleaned);

    let summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
    if (!summary) {
      summary = fallbackSummary;
    }

    let tags: string[] = [];
    if (Array.isArray(parsed.tags)) {
      tags = parsed.tags
        .filter((t: unknown) => typeof t === "string" && t.trim().length > 0)
        .map((t: string) => t.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ""))
        .filter(Boolean);
    }

    // Ensure 3-5 unique tags
    const uniqueTags = Array.from(new Set(tags));
    if (uniqueTags.length < 3) {
      const defaultTag = (language || "code").toLowerCase();
      if (!uniqueTags.includes(defaultTag)) uniqueTags.push(defaultTag);
      if (!uniqueTags.includes("snippet")) uniqueTags.push("snippet");
      if (!uniqueTags.includes("dev")) uniqueTags.push("dev");
    }

    return {
      summary,
      tags: uniqueTags.slice(0, 5),
      success: true,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to generate AI analysis";

    console.error("Gemini AI generation error:", errorMessage);

    return {
      summary: fallbackSummary,
      tags: fallbackTags,
      success: false,
      error: errorMessage,
    };
  }
}
