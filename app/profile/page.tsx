"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import {
  getUserSettings,
  updateUserSettings,
} from "@/app/actions/settingsActions";

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    shortIntro: "",
    portfolioLink: "",
    githubLink: "",
    linkedinLink: "",
    emailSignature: "",
  });

  // Fetch data on load
  useEffect(() => {
    async function loadData() {
      const data = await getUserSettings();
      setFormData((prev) => ({ ...prev, ...data }));
    }
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateUserSettings(formData);
    setIsSaving(false);
  };

  return (
    <div className="p-4 md:p-8 w-full max-w-4xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Your personal information used in job applications
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-zinc-100 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Personal Info Card */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="text-sm font-medium text-white mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                Address / Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">
              Short Intro
            </label>
            <textarea
              name="shortIntro"
              value={formData.shortIntro}
              onChange={handleChange}
              rows={3}
              placeholder="A brief introduction about yourself..."
              className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 resize-none"
            ></textarea>
          </div>
        </div>

        {/* Links Card */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="text-sm font-medium text-white mb-4">Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                Portfolio Link
              </label>
              <input
                type="url"
                name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleChange}
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  GitHub Link
                </label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  LinkedIn Link
                </label>
                <input
                  type="url"
                  name="linkedinLink"
                  value={formData.linkedinLink}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Signature */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="text-sm font-medium text-white mb-4">
            Email Signature
          </h3>
          <textarea
            name="emailSignature"
            value={formData.emailSignature}
            onChange={handleChange}
            rows={3}
            placeholder="Auto-appended to your application emails"
            className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
