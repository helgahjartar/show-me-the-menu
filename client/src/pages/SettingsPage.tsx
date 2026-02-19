import { useState, useEffect } from "react";
import { fetchSettings, updateSettings } from "../api/settings";
import type { AppSettings } from "../types";
import { btnPrimary, input } from "../utils/styles";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings().then(setSettings).catch(() => {
      setMessage({ type: "error", text: "Failed to load settings." });
    });
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateSettings({ anthropicApiKey: apiKey.trim() });
      setSettings(updated);
      setApiKey("");
      setMessage({ type: "success", text: "API key saved successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to save API key." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[560px]">
      <h1 className="text-3xl leading-tight m-0 mb-4">Settings</h1>

      <div className="bg-white border border-border rounded-lg p-4">
        <h2 className="text-2xl m-0 mb-2">Anthropic API Key</h2>

        {settings && (
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                settings.hasApiKey ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-text-muted">
              {settings.hasApiKey ? "API key is configured" : "No API key configured"}
            </span>
          </div>
        )}

        <p className="text-sm text-text-muted mb-4">
          Enter your Anthropic API key to enable AI-powered menu generation. Without a key, menus
          will be generated with random recipe selection.
        </p>

        <div className="mb-4">
          <input
            type="password"
            className={input}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6 items-center">
        <button
          className={`${btnPrimary} ${saving || !apiKey.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleSave}
          disabled={saving || !apiKey.trim()}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {message && (
          <span className={`text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
