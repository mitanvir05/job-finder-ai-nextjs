"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Copy, Trash2, Star, X, Loader2,Save } from "lucide-react";
import {
  getTemplates,
  saveTemplate,
  deleteTemplate,
  setDefaultTemplate,
} from "@/app/actions/templateActions";

type Template = {
  _id: string;
  name: string;
  subject: string;
  body: string;
  isDefault: boolean;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    subject: "",
    body: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    const data = await getTemplates();
    setTemplates(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (template?: Template) => {
    if (template) {
      setFormData({
        id: template._id,
        name: template.name,
        subject: template.subject,
        body: template.body,
      });
    } else {
      setFormData({ id: "", name: "", subject: "", body: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.subject || !formData.body)
      return alert("Please fill all fields");
    setIsSaving(true);
    await saveTemplate(formData);
    setIsSaving(false);
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate(id);
      loadData();
    }
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultTemplate(id);
    loadData();
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Email Templates
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Create reusable email templates with variables like {"{job_title}"}
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-zinc-100 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> New Template
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-zinc-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl._id}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex flex-col"
            >
              <div className="flex justify-between items-start border-b border-[var(--color-border)] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{tpl.name}</h3>
                  {tpl.isDefault && (
                    <span className="bg-zinc-800 text-zinc-300 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={10} className="fill-zinc-300" /> Default
                    </span>
                  )}
                </div>
                {!tpl.isDefault && (
                  <button
                    onClick={() => handleSetDefault(tpl._id)}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Set Default
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-6">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Subject</p>
                  <p className="text-sm text-zinc-200 font-mono bg-black/30 p-2 rounded-lg border border-[var(--color-border)] truncate">
                    {tpl.subject}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Body Preview</p>
                  <p className="text-sm text-zinc-400 line-clamp-3">
                    {tpl.body}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[var(--color-border)]">
                <button
                  onClick={() => handleOpenModal(tpl)}
                  className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(tpl._id)}
                  className="text-xs flex items-center gap-1.5 text-red-500/80 hover:text-red-400 transition-colors ml-auto"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-20 border border-dashed border-[var(--color-border)] rounded-xl">
              <p className="text-sm text-zinc-400">
                No templates found. Create one to get started!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-semibold text-white">
                {formData.id ? "Edit Template" : "New Template"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
                <p className="text-xs text-blue-400">
                  <span className="font-bold">Available Variables:</span>{" "}
                  {"{job_title}"}, {"{company_name}"}, {"{recruiter_name}"}
                </p>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Template Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Formal Application"
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Application for {job_title} at {company_name}"
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Email Body
                </label>
                <textarea
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  rows={8}
                  placeholder="Dear {recruiter_name},&#10;&#10;I am writing to express my interest in the {job_title} role..."
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 font-mono resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-[var(--color-border)] flex justify-end gap-3 bg-zinc-900/50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-zinc-100 text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
