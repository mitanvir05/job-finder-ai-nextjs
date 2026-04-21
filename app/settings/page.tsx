"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import {
  getUserSettings,
  updateUserSettings,
} from "@/app/actions/settingsActions";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    fromAddress: "",
    geminiApiKey: "",
  });

  useEffect(() => {
    async function loadData() {
      const data = await getUserSettings();
      setFormData((prev) => ({ ...prev, ...data }));
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Configure email and application settings
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
        {/* SMTP Configuration */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-6">
          <h3 className="text-sm font-medium text-white mb-2">
            SMTP Configuration
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Optional: Configure SMTP to send emails directly from the app. Leave
            blank to use mailto/Gmail compose links instead.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                SMTP Host
              </label>
              <input
                type="text"
                name="smtpHost"
                value={formData.smtpHost}
                onChange={handleChange}
                placeholder="smtp.gmail.com"
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                SMTP Port
              </label>
              <input
                type="text"
                name="smtpPort"
                value={formData.smtpPort}
                onChange={handleChange}
                placeholder="465"
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                SMTP Username
              </label>
              <input
                type="text"
                name="smtpUser"
                value={formData.smtpUser}
                onChange={handleChange}
                placeholder="email@gmail.com"
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">
                SMTP Password (App Password)
              </label>
              <input
                type="password"
                name="smtpPass"
                value={formData.smtpPass}
                onChange={handleChange}
                placeholder="••••••••••••••••"
                className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">
              From Address
            </label>
            <input
              type="text"
              name="fromAddress"
              value={formData.fromAddress}
              onChange={handleChange}
              placeholder='"Your Name" <email@gmail.com>'
              className="w-full bg-black/50 border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
