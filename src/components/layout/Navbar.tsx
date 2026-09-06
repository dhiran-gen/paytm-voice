// Enterprise Navbar for Admission Intelligence Platform

import {
  BrainCircuit,
  Cpu,
  FilePlus2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Moon,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sun,
  Users,
  Users2
} from 'lucide-react';
import React from 'react';
import { MainNavigationTab, useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    theme,
    toggleTheme,
    selectedForComparison,
    llmConfig,
    openApiKeyModal,
    openNewApplicationModal,
    resetAllData,
  } = useApp();

  const navItems: { id: MainNavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'APPLICATIONS', label: 'Applications', icon: Users },
    { id: 'APPLICANT_DETAIL', label: 'Dossier Hub', icon: BrainCircuit },
    { id: 'COMPARE', label: 'Compare', icon: Users2, badge: selectedForComparison.length },
    { id: 'SEARCH', label: 'Semantic Search', icon: Search },
    { id: 'REPORT', label: 'Committee Report', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                    Admission Copilot
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Explainable AI & Multi-Agent Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Links (Only in Officer Mode) */}
          {userRole === 'ADMISSION_OFFICER' && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* User Role Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-semibold">
              <button
                onClick={() => {
                  setUserRole('ADMISSION_OFFICER');
                  if (activeTab === 'PORTAL') setActiveTab('DASHBOARD');
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  userRole === 'ADMISSION_OFFICER'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Switch to Admissions Officer Workspace"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Officer</span>
              </button>
              <button
                onClick={() => {
                  setUserRole('APPLICANT');
                  setActiveTab('PORTAL');
                }}
                className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  userRole === 'APPLICANT'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Switch to Student / Applicant Portal"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Applicant Portal</span>
              </button>
            </div>

            {/* LLM Engine Indicator Button */}
            <button
              onClick={openApiKeyModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              title="Configure LLM API Provider & Key"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden lg:inline font-mono text-[11px]">
                {llmConfig.provider === 'GEMINI' ? 'Gemini 2.0' : llmConfig.provider === 'OPENAI' ? 'GPT-4o' : 'Custom LLM'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  llmConfig.apiKey ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Toggle Light / Dark Mode"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Reset Data Button */}
            <button
              onClick={resetAllData}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors hidden sm:block"
              title="Reset sample data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* New Application CTA Button */}
            {userRole === 'ADMISSION_OFFICER' && (
              <button
                onClick={openNewApplicationModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shadow-blue-500/30 transition-all hover:scale-102 active:scale-98"
              >
                <FilePlus2 className="w-4 h-4" />
                <span className="hidden sm:inline">New Application</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
