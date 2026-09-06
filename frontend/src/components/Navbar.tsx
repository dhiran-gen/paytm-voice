import React from 'react';
import {
  Sparkles,
  BarChart3,
  Bot,
  Database,
  Key,
  RotateCcw,
  Store,
  Layers
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'recommendations' | 'copilot' | 'simulator' | 'data';
  setActiveTab: (tab: 'recommendations' | 'copilot' | 'simulator' | 'data') => void;
  onOpenApiKeyModal: () => void;
  onResetData: () => void;
  hasGeminiKey: boolean;
  totalSkus: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiKeyModal,
  onResetData,
  hasGeminiKey,
  totalSkus,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">PromoAlign</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Retail Promotion & Inventory Alignment</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'recommendations'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Recommendations</span>
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'copilot'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Copilot</span>
              {hasGeminiKey && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>What-If Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'data'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Store Inventory & Data</span>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300">
                {totalSkus}
              </span>
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onResetData}
              title="Reset to Sample Retail Dataset"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                hasGeminiKey
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {hasGeminiKey ? 'Gemini AI Live' : 'Set Gemini Key'}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`p-2 rounded-lg ${activeTab === 'recommendations' ? 'text-sky-400 bg-slate-800' : 'text-slate-400'}`}
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`p-2 rounded-lg ${activeTab === 'copilot' ? 'text-sky-400 bg-slate-800' : 'text-slate-400'}`}
          >
            <Bot className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`p-2 rounded-lg ${activeTab === 'simulator' ? 'text-sky-400 bg-slate-800' : 'text-slate-400'}`}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`p-2 rounded-lg ${activeTab === 'data' ? 'text-sky-400 bg-slate-800' : 'text-slate-400'}`}
          >
            <Database className="w-5 h-5" />
          </button>
        </div>

      </div>
    </header>
  );
};
