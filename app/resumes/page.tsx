"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Upload,
  Trash2,
  Star,
  Download,
  Eye,
  Loader2,
} from "lucide-react";
import {
  getResumes,
  uploadResume,
  deleteResume,
  setDefaultResume,
} from "@/app/actions/resumeActions";

type Resume = {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  isDefault: boolean;
};

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setIsLoading(true);
    const data = await getResumes();
    setResumes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadResume(formData);

    if (result.success) {
      await loadData();
    } else {
      alert(result.error);
    }

    setIsUploading(false);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      await deleteResume(id);
      loadData();
    }
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultResume(id);
    loadData();
  };

  // Helper to format file sizes (e.g., 1024 -> 1MB)
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(0)) + " " + sizes[i];
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Resumes</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Manage your CV/Resume PDFs
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="application/pdf"
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-zinc-100 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2 justify-center"
        >
          {isUploading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {isUploading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-zinc-500" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* File Info */}
              <div className="flex items-start md:items-center gap-4">
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 text-zinc-400 shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-white">
                      {resume.fileName}
                    </h3>
                    {resume.isDefault && (
                      <span className="bg-zinc-800 text-zinc-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={10} className="fill-zinc-300" /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">
                    PDF Document • {formatBytes(resume.fileSize)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 border-t border-[var(--color-border)] md:border-none pt-4 md:pt-0">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors p-2"
                  title="View PDF"
                >
                  <Eye size={18} />
                </a>

                {!resume.isDefault && (
                  <button
                    onClick={() => handleSetDefault(resume._id)}
                    className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 border border-[var(--color-border)] rounded-md"
                  >
                    Set Default
                  </button>
                )}

                <button
                  onClick={() => handleDelete(resume._id)}
                  className="text-red-500/80 hover:text-red-400 transition-colors p-2"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {resumes.length === 0 && (
            <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-xl">
              <FileText className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-400">
                No resumes uploaded. Click the button above to add a PDF.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
