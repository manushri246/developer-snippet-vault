"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Code2 } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code to clipboard", err);
    }
  };

  // Map common languages to prism aliases
  const prismLanguage =
    language.toLowerCase() === "csharp"
      ? "csharp"
      : language.toLowerCase() === "cpp"
      ? "cpp"
      : language.toLowerCase() || "javascript";

  return (
    <div className="relative group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="flex items-center text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
            <Code2 className="w-3 h-3 mr-1" />
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code to clipboard"
          className="flex items-center space-x-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 transition-all duration-200 border border-zinc-700/60 px-2.5 py-1 rounded-md cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax highlighted code */}
      <div className="overflow-x-auto text-sm font-mono max-h-[550px]">
        <SyntaxHighlighter
          language={prismLanguage}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
          codeTagProps={{
            style: {
              fontFamily: "var(--font-mono), monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
