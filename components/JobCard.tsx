"use client";

import { useState } from "react";
import { ExternalLink, Save, Check, Loader2 } from "lucide-react";
import { saveJobAsDraft } from "@/app/actions/applicationActions";

interface JobCardProps {
  title: string;
  company: string;
  description: string;
  emailFound: boolean;
  email?: string | null;
}

export default function JobCard({
  title,
  company,
  description,
  emailFound,
  email,
}: JobCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const result = await saveJobAsDraft({ title, company, description, email });
    setIsSaving(false);

    if (result.success) {
      setIsSaved(true);
    } else {
      alert("Failed to save draft.");
    }
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-zinc-100">{title}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {company}
          </p>
        </div>
        {emailFound ? (
          <span className="bg-green-500/10 text-green-500 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-medium border border-green-500/20 whitespace-nowrap">
            Email Found
          </span>
        ) : (
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] px-2 py-1 bg-zinc-800/50 rounded-full font-medium whitespace-nowrap">
            No Email
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--color-text-secondary)] mt-4 flex-1 line-clamp-3">
        {description}
      </p>

      {email && (
        <div className="mt-4 p-2.5 bg-black/40 rounded-lg border border-[var(--color-border)] text-sm text-zinc-300 font-mono">
          {email}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-[var(--color-text-secondary)] border border-[var(--color-border)] rounded-lg hover:bg-zinc-800 transition-colors">
          <ExternalLink size={16} /> View Post
        </button>

        <button
          onClick={handleSaveDraft}
          disabled={isSaving || isSaved}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-colors ${
            isSaved
              ? "bg-green-600 text-white border border-green-500"
              : "bg-zinc-100 text-black hover:bg-white disabled:opacity-50"
          }`}
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isSaved ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : isSaved ? "Saved!" : "Save Draft"}
        </button>
      </div>
    </div>
  );
}
