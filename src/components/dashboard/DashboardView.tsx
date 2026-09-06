// Executive Admissions Intelligence Dashboard

import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  DollarSign,
  FileCheck,
  FileSearch,
  Globe2,
  GraduationCap,
  Sparkles,
  UserCheck,
  Users2
} from 'lucide-react';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    applicants,
    selectApplicant,
    setActiveTab,
    openNewApplicationModal,
  } = useApp();

  // 1. KPI Calculations
  const totalApps = applicants.length;
  const reviewCompleted = applicants.filter(a => a.status === 'REVIEW_COMPLETED' || a.status === 'OFFICER_DECIDED').length;
  const interviewRecommended = applicants.filter(a => a.reasoningResult?.overallRecommendation === 'INTERVIEW_RECOMMENDED' || a.status === 'INTERVIEW_RECOMMENDED').length;
  const financialReview = applicants.filter(a => a.financialAnalysis?.readinessStatus === 'PARTIAL_GAP' || a.financialAnalysis?.readinessStatus === 'DEFICIT' || a.status === 'FINANCIAL_REVIEW_REQUIRED').length;
  const highPotential = applicants.filter(a => a.reasoningResult?.overallRecommendation === 'STRONGLY_RECOMMEND_ADMIT' || (a.normalizedGPA >= 3.8 && (a.reasoningResult?.confidenceScore || 0) >= 90)).length;
  const flaggedRiskCount = applicants.filter(a => a.riskAnalysis?.overallRiskLevel === 'HIGH' || a.riskAnalysis?.overallRiskLevel === 'MEDIUM').length;

  // 2. Chart 1: Country Distribution
  const countryCounts: Record<string, number> = {};
  applicants.forEach(a => {
    countryCounts[a.countryOfOrigin] = (countryCounts[a.countryOfOrigin] || 0) + 1;
  });
  const countryChartData = Object.entries(countryCounts).map(([country, count]) => ({
    country,
    count,
  }));

  // 3. Chart 2: Degree & Program Distribution
  const programCounts: Record<string, number> = {};
  applicants.forEach(a => {
    const prog = a.targetProgram.replace('MS in ', '');
    programCounts[prog] = (programCounts[prog] || 0) + 1;
  });
  const programChartData = Object.entries(programCounts).map(([name, value]) => ({
    name,
    value,
  }));
  const PIE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  // 4. Chart 3: Recommendation Distribution
  const recCounts: Record<string, number> = {
    'Strong Admit': 0,
    'Admit': 0,
    'Interview': 0,
    'Financial Review': 0,
    'Conditional': 0,
  };
  applicants.forEach(a => {
    const rec = a.reasoningResult?.overallRecommendation;
    if (rec === 'STRONGLY_RECOMMEND_ADMIT') recCounts['Strong Admit']++;
    else if (rec === 'RECOMMEND_ADMIT') recCounts['Admit']++;
    else if (rec === 'INTERVIEW_RECOMMENDED') recCounts['Interview']++;
    else if (rec === 'FINANCIAL_REVIEW_REQUIRED') recCounts['Financial Review']++;
    else recCounts['Conditional']++;
  });
  const recChartData = Object.entries(recCounts).map(([tier, count]) => ({
    tier,
    count,
  }));

  // 5. Chart 4: Average GPA & English Scores
  const gpaScatterData = applicants.map(a => ({
    name: `${a.firstName} ${a.lastName}`,
    gpa: a.normalizedGPA,
    english: a.englishProficiencyType === 'TOEFL' ? Math.round((a.englishOverallScore / 120) * 100) : Math.round((a.englishOverallScore / 9.0) * 100),
    country: a.countryOfOrigin,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Admissions Intelligence Engine Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            International Admissions Copilot
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Multi-agent intelligence platform synthesizing academic transcripts, statements of purpose, resumes, letters of recommendation, and financial affidavits with explainable evidence citations.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={openNewApplicationModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-all hover:scale-102"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Create New Application</span>
            </button>
            <button
              onClick={() => setActiveTab('SEARCH')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-all"
            >
              <FileSearch className="w-4 h-4" />
              <span>Semantic Search</span>
            </button>
            <button
              onClick={() => setActiveTab('COMPARE')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-all"
            >
              <Users2 className="w-4 h-4" />
              <span>Compare Candidates</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Apps */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Applications</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalApps}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Active Fall 2026 Cycle</p>
          </div>
        </div>

        {/* AI Analyzed */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">AI Analyzed</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{reviewCompleted}</span>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Multi-agent completed</span>
            </p>
          </div>
        </div>

        {/* High Potential */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">High Potential</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{highPotential}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Top-tier recommendations</p>
          </div>
        </div>

        {/* Interview Recommended */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Interview Rec.</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{interviewRecommended}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Needs viva / follow-up</p>
          </div>
        </div>

        {/* Financial Review */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Financial Review</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{financialReview}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Funding gap / loan pending</p>
          </div>
        </div>

        {/* Flagged Risks */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Flagged Alerts</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{flaggedRiskCount}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Discrepancies / gaps</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Origin Countries */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-500" />
                Applicant Origin Countries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Geographic diversity distribution</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Applicants" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Program Distribution */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                Target Program Breakdown
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Specialization & major distribution</p>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={programChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {programChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Recommendation Tiers */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                AI Recommendation Tiers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Evidence-grounded recommendation breakdown</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="tier" tick={{ fontSize: 11 }} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} name="Candidates" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Academic Rigor Comparison */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-sky-500" />
                Normalized GPA vs English Score Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comparative academic benchmarks across applicants</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpaScatterData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" orientation="left" domain={[2.5, 4.0]} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="gpa" fill="#3b82f6" name="Normalized GPA (4.0)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="english" fill="#10b981" name="English Proficiency %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Applications Table Preview */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Active Applicant Pipeline</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Direct access to multi-agent dossiers and committee summaries</p>
          </div>
          <button
            onClick={() => setActiveTab('APPLICATIONS')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Applications ({applicants.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Applicant Name</th>
                <th className="pb-3">Target Degree & Program</th>
                <th className="pb-3">Origin</th>
                <th className="pb-3">Normalized GPA</th>
                <th className="pb-3">English Test</th>
                <th className="pb-3">AI Recommendation</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applicants.map(app => {
                const rec = app.reasoningResult?.overallRecommendation || 'RECOMMEND_ADMIT';
                const conf = app.reasoningResult?.confidenceScore || 90;
                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs">
                          {app.firstName[0]}{app.lastName[0]}
                        </div>
                        <div>
                          <p>{app.firstName} {app.lastName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{app.applicationNumber}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-700 dark:text-slate-300">
                      <p className="font-medium">{app.targetProgram}</p>
                      <span className="text-[10px] text-slate-500">{app.targetSpecialization || 'General'}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                      {app.countryOfOrigin}
                    </td>
                    <td className="py-3.5 pr-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {app.normalizedGPA ? `${app.normalizedGPA}/4.0` : app.rawGPA}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300 font-mono">
                      {app.englishProficiencyType} {app.englishOverallScore}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rec === 'STRONGLY_RECOMMEND_ADMIT'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/30'
                            : rec === 'RECOMMEND_ADMIT'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300/30'
                            : rec === 'INTERVIEW_RECOMMENDED'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/30'
                            : rec === 'FINANCIAL_REVIEW_REQUIRED'
                            ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300/30'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300/30'
                        }`}
                      >
                        {rec.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${conf}%` }}
                          />
                        </div>
                        <span className="text-[11px]">{conf}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      <button
                        onClick={() => selectApplicant(app.id, 'APPLICANT_DETAIL')}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-semibold rounded-lg transition-colors text-[11px]"
                      >
                        Dossier Hub
                      </button>
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
