"use client";

import { useState } from "react";
import { deleteSnippet } from "@/app/actions/snippets";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteButtonProps {
  snippetId: string;
  snippetTitle: string;
}

export function DeleteButton({ snippetId, snippetTitle }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSnippet(snippetId);
    } catch (err) {
      console.error("Failed to delete snippet", err);
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        title="Delete snippet"
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Delete Snippet
                </h3>
                <p className="text-xs text-zinc-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
              Are you sure you want to delete{" "}
              <strong className="text-white">&quot;{snippetTitle}&quot;</strong>?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
