"use client";

import { useState, useEffect } from "react";
import { Send, Loader2, Mail } from "lucide-react";
import { getTemplates } from "@/app/actions/templateActions";
import { getResumes } from "@/app/actions/resumeActions";
import { sendApplicationEmail } from "@/app/actions/emailActions";

export default function QuickSendPage() {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "error" | "success";
    msg: string;
  } | null>(null);

  const [templates, setTemplates] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);

  // ADDED recruiterName to the state
  const [formData, setFormData] = useState({
    recruiterEmail: "",
    recruiterName: "",
    company: "",
    jobTitle: "",
    selectedTemplateId: "",
    selectedResumeId: "",
  });

  const [activeTemplate, setActiveTemplate] = useState<{
    subject: string;
    body: string;
  } | null>(null);

  useEffect(() => {
    async function loadResources() {
      setIsLoadingData(true);
      const [tplData, resData] = await Promise.all([
        getTemplates(),
        getResumes(),
      ]);

      setTemplates(tplData);
      setResumes(resData);

      const defaultTpl = tplData.find((t: any) => t.isDefault) || tplData[0];
      const defaultRes = resData.find((r: any) => r.isDefault) || resData[0];

      setFormData((prev) => ({
        ...prev,
        selectedTemplateId: defaultTpl?._id || "",
        selectedResumeId: defaultRes?._id || "",
      }));

      if (defaultTpl) setActiveTemplate(defaultTpl);

      setIsLoadingData(false);
    }
    loadResources();
  }, []);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData((prev) => ({ ...prev, selectedTemplateId: id }));
    const tpl = templates.find((t) => t._id === id);
    if (tpl) setActiveTemplate(tpl);
  };

  const handleSend = async () => {
    if (
      !formData.recruiterEmail ||
      !formData.company ||
      !formData.jobTitle ||
      !formData.selectedResumeId ||
      !activeTemplate
    ) {
      setStatusMsg({
        type: "error",
        msg: "Please fill in all required fields and select a resume/template.",
      });
      return;
    }

    setIsSending(true);
    setStatusMsg(null);

    const result = await sendApplicationEmail({
      company: formData.company,
      jobTitle: formData.jobTitle,
      recruiterEmail: formData.recruiterEmail,
      recruiterName: formData.recruiterName, 
      templateSubject: activeTemplate.subject,
      templateBody: activeTemplate.body,
      resumeId: formData.selectedResumeId,
    });

    if (result.success) {
      setStatusMsg({ type: "success", msg: "Email sent successfully!" });
      setFormData((prev) => ({
        ...prev,
        recruiterEmail: "",
        recruiterName: "",
        company: "",
        jobTitle: "",
      }));
    } else {
      setStatusMsg({
        type: "error",
        msg: result.error || "Failed to send email.",
      });
    }
    setIsSending(false);
  };

  if (isLoadingData)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
      </div>
    );

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Quick Apply</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Fill in job details and send your application with one click.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 mb-8 rounded-xl border text-sm ${statusMsg.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}
        >
          {statusMsg.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-6">
              Job Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Recruiter Email *
                </label>
                <input
                  type="email"
                  value={formData.recruiterEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, recruiterEmail: e.target.value })
                  }
                  placeholder="recruiter@company.com"
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              {/* ADDED Recruiter Name Input */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Recruiter Name
                </label>
                <input
                  type="text"
                  value={formData.recruiterName}
                  onChange={(e) =>
                    setFormData({ ...formData, recruiterName: e.target.value })
                  }
                  placeholder="John Doe (Optional)"
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Company *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="Google"
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, jobTitle: e.target.value })
                  }
                  placeholder="Senior Frontend Developer"
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          </div>

          {/* Email Preview Section */}
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Mail size={16} /> Email Preview
              </h3>
              <select
                value={formData.selectedTemplateId}
                onChange={handleTemplateChange}
                className="bg-black/50 border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
              >
                {templates.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {activeTemplate ? (
              <div className="bg-black/30 border border-zinc-800 rounded-lg p-4 font-mono text-sm">
                <p className="text-zinc-500 mb-2 border-b border-zinc-800 pb-2">
                  <span className="font-bold">Subj:</span>{" "}
                  {activeTemplate.subject
                    .replace(
                      /{job_title}/gi,
                      formData.jobTitle || "[Job Title]",
                    )
                    .replace(
                      /{company_name}/gi,
                      formData.company || "[Company]",
                    )
                    .replace(
                      /{recruiter_name}/gi,
                      formData.recruiterName || "[Recruiter Name]",
                    )}
                </p>
                <div className="text-zinc-300 whitespace-pre-wrap">
                  {activeTemplate.body
                    .replace(
                      /{job_title}/gi,
                      formData.jobTitle || "[Job Title]",
                    )
                    .replace(
                      /{company_name}/gi,
                      formData.company || "[Company]",
                    )
                    .replace(
                      /{recruiter_name}/gi,
                      formData.recruiterName || "[Recruiter Name]",
                    )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-red-400">
                No templates found. Please create one in the Templates page.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              Resume / CV
            </h3>
            <select
              value={formData.selectedResumeId}
              onChange={(e) =>
                setFormData({ ...formData, selectedResumeId: e.target.value })
              }
              className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="" disabled>
                Select a resume...
              </option>
              {resumes.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.fileName}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white mb-2">Actions</h3>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="w-full bg-zinc-100 text-black px-4 py-3 rounded-lg text-sm font-medium hover:bg-white transition-colors flex justify-center items-center gap-2"
            >
              {isSending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isSending ? "Sending via SMTP..." : "Send Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
