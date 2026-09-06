// Main Application Root for Admission Intelligence Platform

import React from 'react';
import { ApplicantDetailView } from './components/applicantDetail/ApplicantDetailView';
import { ApplicantPortalView } from './components/applicantPortal/ApplicantPortalView';
import { ApplicationsListView } from './components/applications/ApplicationsListView';
import { NewApplicationModal } from './components/applications/NewApplicationModal';
import { ApplicantComparisonView } from './components/comparison/ApplicantComparisonView';
import { DashboardView } from './components/dashboard/DashboardView';
import { ApiKeyModal } from './components/layout/ApiKeyModal';
import { Navbar } from './components/layout/Navbar';
import { ResponsibleAIBanner } from './components/layout/ResponsibleAIBanner';
import { ApplicantReportView } from './components/report/ApplicantReportView';
import { SemanticSearchView } from './components/search/SemanticSearchView';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const { activeTab, userRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Responsible AI Disclaimer Banner */}
      <ResponsibleAIBanner />

      {/* Enterprise SaaS Navbar */}
      <Navbar />

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {userRole === 'APPLICANT' ? (
          <ApplicantPortalView />
        ) : (
          <>
            {activeTab === 'DASHBOARD' && <DashboardView />}
            {activeTab === 'APPLICATIONS' && <ApplicationsListView />}
            {activeTab === 'APPLICANT_DETAIL' && <ApplicantDetailView />}
            {activeTab === 'COMPARE' && <ApplicantComparisonView />}
            {activeTab === 'SEARCH' && <SemanticSearchView />}
            {activeTab === 'REPORT' && <ApplicantReportView />}
            {activeTab === 'PORTAL' && <ApplicantPortalView />}
          </>
        )}
      </main>

      {/* Modals */}
      <ApiKeyModal />
      <NewApplicationModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400 print:hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            &copy; {new Date().getFullYear()} Admission Copilot &bull; Explainable Multi-Agent Admissions Intelligence
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Responsible AI Framework</span>
            <span>&bull;</span>
            <span>RAG Document Retrieval</span>
            <span>&bull;</span>
            <span>Knowledge Graph Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
