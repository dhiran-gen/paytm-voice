// API Key & LLM Provider Configuration Modal

import { CheckCircle2, Cpu, Key, Loader2, RefreshCw, X } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { testLLMConnection } from '../../services/llmService';
import { LLMConfig } from '../../types';

export const ApiKeyModal: React.FC = () => {
  const { isApiKeyModalOpen, closeApiKeyModal, llmConfig, updateLLMConfig } = useApp();
  const [formData, setFormData] = useState<LLMConfig>({ ...llmConfig });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isApiKeyModalOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testLLMConnection(formData);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    updateLLMConfig(formData);
    closeApiKeyModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">LLM Provider Configuration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure real LLMs (Gemini / OpenAI / Compatible)</p>
            </div>
          </div>
          <button
            onClick={closeApiKeyModal}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select LLM Engine
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'GEMINI', name: 'Google Gemini', desc: 'Fast & High Context' },
                { id: 'OPENAI', name: 'OpenAI GPT-4o', desc: 'Enterprise Standard' },
                { id: 'CUSTOM_OPENAI', name: 'Custom / Local', desc: 'Groq / Ollama / DeepSeek' },
              ].map(prov => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, provider: prov.id as any })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    formData.provider === prov.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-semibold text-xs">{prov.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{prov.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          {formData.provider === 'GEMINI' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Gemini Model
              </label>
              <select
                value={formData.geminiModel}
                onChange={e => setFormData({ ...formData, geminiModel: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended - Ultra Fast & Accurate)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Multimodal Reasoning)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Lightweight)</option>
              </select>
            </div>
          )}

          {formData.provider === 'OPENAI' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                OpenAI Model
              </label>
              <select
                value={formData.openaiModel}
                onChange={e => setFormData({ ...formData, openaiModel: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cost Effective)</option>
                <option value="gpt-4o">GPT-4o (State-of-the-Art Multimodal)</option>
              </select>
            </div>
          )}

          {formData.provider === 'CUSTOM_OPENAI' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Custom Base URL Endpoint
                </label>
                <input
                  type="text"
                  placeholder="https://api.groq.com/openai/v1/chat/completions or http://localhost:11434/v1/chat/completions"
                  value={formData.customEndpoint || ''}
                  onChange={e => setFormData({ ...formData, customEndpoint: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Custom Model Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. llama-3.3-70b-versatile, deepseek-chat, qwen2.5"
                  value={formData.customModelName || ''}
                  onChange={e => setFormData({ ...formData, customModelName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                API Key
              </label>
              {formData.provider === 'GEMINI' && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Get Free Gemini API Key &rarr;
                </a>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder={formData.provider === 'GEMINI' ? 'AIzaSy...' : 'sk-...'}
                value={formData.apiKey}
                onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Your API key stays securely inside your browser session and is never sent to third-party tracking servers.
            </p>
          </div>

          {/* High Fidelity Heuristic Fallback Note */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Offline / Heuristic Engine Active
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              The platform includes built-in semantic analysis, OCR ingestion, vector cosine search, and pre-computed intelligence models. If you do not provide an API key, the platform will seamlessly run in high-fidelity offline mode.
            </p>
          </div>

          {/* Test Connection Status Banner */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
              <span className="font-medium">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Test Live API
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeApiKeyModal}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/30 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
