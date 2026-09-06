// Applications Pipeline & Directory View

import {
  AlertTriangle,
  Brain,
  CheckSquare,
  FilePlus2,
  FileText,
  Filter,
  Search,
  Square,
  Star,
  Users2
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ApplicationsListView: React.FC = () => {
  const {
    applicants,
    selectApplicant,
    setActiveTab,
    selectedForComparison,
    toggleCompareSelection,
    toggleFavorite,
    openNewApplicationModal,
    runAnalysisForApplicant,
    isAnalyzing,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');

  // Distinct countries for filter
  const countries = Array.from(new Set(applicants.map(a => a.countryOfOrigin)));

  // Filtered applicants
  const filtered = applicants.filter(app => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      app.firstName.toLowerCase().includes(query) ||
      app.lastName.toLowerCase().includes(query) ||
      app.targetProgram.toLowerCase().includes(query) ||
      app.undergraduateInstitution.toLowerCase().includes(query) ||
      app.countryOfOrigin.toLowerCase().includes(query) ||
      app.applicationNumber.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'RECOMMENDED' && app.reasoningResult?.overallRecommendation === 'STRONGLY_RECOMMEND_ADMIT') ||
      (statusFilter === 'INTERVIEW' && app.reasoningResult?.overallRecommendation === 'INTERVIEW_RECOMMENDED') ||
      (statusFilter === 'FINANCIAL' && app.reasoningResult?.overallRecommendation === 'FINANCIAL_REVIEW_REQUIRED');

    const matchesRisk =
      riskFilter === 'ALL' ||
      app.riskAnalysis?.overallRiskLevel === riskFilter;

    const matchesCountry =
      countryFilter === 'ALL' ||
      app.countryOfOrigin === countryFilter;

    return matchesSearch && matchesStatus && matchesRisk && matchesCountry;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>International Applications Directory</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {filtered.length} of {applicants.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select candidates to compare side-by-side or inspect evidence-grounded dossiers
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedForComparison.length > 0 && (
            <button
              onClick={() => setActiveTab('COMPARE')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Users2 className="w-4 h-4" />
              <span>Compare Selected ({selectedForComparison.length})</span>
            </button>
          )}

          <button
            onClick={openNewApplicationModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, university, program, ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Recommendation Tiers</option>
            <option value="RECOMMENDED">Strongly Recommended</option>
            <option value="INTERVIEW">Interview Recommended</option>
            <option value="FINANCIAL">Financial Review Required</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div>
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk (Clean)</option>
            <option value="MEDIUM">Medium Risk (Minor Discrepancy)</option>
            <option value="HIGH">High Risk (Attention Required)</option>
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Origin Countries</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-8">Compare</th>
                <th className="py-3 pr-4">Applicant & ID</th>
                <th className="py-3 pr-4">Target Degree & Term</th>
                <th className="py-3 pr-4">Undergraduate Pedigree</th>
                <th className="py-3 pr-4">GPA / English</th>
                <th className="py-3 pr-4">Financial Readiness</th>
                <th className="py-3 pr-4">Risk Audit</th>
                <th className="py-3 pr-4">AI Recommendation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(app => {
                const isSelected = selectedForComparison.includes(app.id);
                const rec = app.reasoningResult?.overallRecommendation || 'RECOMMEND_ADMIT';
                const conf = app.reasoningResult?.confidenceScore || 90;
                const risk = app.riskAnalysis?.overallRiskLevel || 'LOW';
                const finStatus = app.financialAnalysis?.readinessStatus || 'FULLY_FUNDED';

                return (
                  <tr
                    key={app.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors ${
                      isSelected ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Compare Checkbox */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleCompareSelection(app.id)}
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Toggle for side-by-side comparison"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Applicant & ID */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => toggleFavorite(app.id)}
                          className={`p-1 rounded-lg transition-colors ${
                            app.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-400'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer" onClick={() => selectApplicant(app.id)}>
                            {app.firstName} {app.lastName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">{app.applicationNumber} • {app.countryOfOrigin}</span>
                        </div>
                      </div>
                    </td>

                    {/* Target Degree */}
                    <td className="py-4 pr-4 text-slate-700 dark:text-slate-300">
                      <p className="font-semibold text-xs">{app.targetProgram}</p>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{app.targetSpecialization || 'General Track'} • {app.targetTerm}</span>
                    </td>

                    {/* Undergraduate Institution */}
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-300">
                      <p className="font-medium text-xs truncate max-w-[180px]">{app.undergraduateInstitution}</p>
                      <span className="text-[10px] text-slate-400">{app.undergraduateMajor}</span>
                    </td>

                    {/* GPA / English */}
                    <td className="py-4 pr-4">
                      <div className="font-mono text-xs">
                        <span className="font-bold text-slate-900 dark:text-white">{app.normalizedGPA ? `${app.normalizedGPA}/4.0` : app.rawGPA}</span>
                        <p className="text-[10px] text-slate-500">{app.englishProficiencyType} {app.englishOverallScore}</p>
                      </div>
                    </td>

                    {/* Financial Readiness */}
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          finStatus === 'FULLY_FUNDED'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {finStatus.replace(/_/g, ' ')}
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        ${(app.financialAnalysis?.totalVerifiedLiquidFundsUSD || 60000).toLocaleString()} USD
                      </p>
                    </td>

                    {/* Risk Audit */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            risk === 'LOW'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : risk === 'MEDIUM'
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {risk !== 'LOW' && <AlertTriangle className="w-3 h-3" />}
                          {risk} RISK
                        </span>
                      </div>
                    </td>

                    {/* AI Recommendation & Confidence */}
                    <td className="py-4 pr-4">
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            rec === 'STRONGLY_RECOMMEND_ADMIT'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : rec === 'RECOMMEND_ADMIT'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                              : rec === 'INTERVIEW_RECOMMENDED'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                              : rec === 'FINANCIAL_REVIEW_REQUIRED'
                              ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {rec.replace(/_/g, ' ')}
                        </span>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                          <span>Confidence:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{conf}%</span>
                        </div>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => runAnalysisForApplicant(app.id)}
                          disabled={isAnalyzing}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="Rerun Multi-Agent Analysis"
                        >
                          <Brain className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            selectApplicant(app.id);
                            setActiveTab('REPORT');
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          title="View Official Report"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => selectApplicant(app.id, 'APPLICANT_DETAIL')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow-2xs transition-colors"
                        >
                          Dossier Hub
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
