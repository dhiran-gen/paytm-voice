import React, { useState } from 'react';
import { updateApiKey } from '../services/api';
import { Key, Sparkles, X, Check, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
  hasKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
  hasKey
}) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await updateApiKey(apiKey);
      setStatus('API Key saved successfully!');
      onKeyUpdated();
      setTimeout(() => {
        onClose();
        setStatus(null);
      }, 1500);
    } catch (err: any) {
      setStatus(`Failed to save key: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Gemini API Configuration</h3>
              <p className="text-xs text-slate-400">Power your conversational Retail Copilot</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/60 text-sky-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Free Google Gemini Key</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Get a free API key from Google AI Studio. The system also includes an intelligent offline heuristic engine if no key is provided.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold mt-1"
            >
              <span>Get free Gemini API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            {hasKey && (
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>An API key is currently active. Entering a new key will overwrite it.</span>
              </p>
            )}
          </div>

          {status && (
            <div className="p-2.5 rounded-lg bg-slate-950 text-slate-200 text-center text-xs">
              {status}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold shadow-md shadow-sky-600/30"
            >
              {loading ? 'Saving...' : 'Save & Activate'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
