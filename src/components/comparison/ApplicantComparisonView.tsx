// Multi-Applicant Side-by-Side Comparator & Cohort Synthesis

import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Loader2,
  UserPlus,
  Users2,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { generateApplicantComparisonReport } from '../../services/ragService';
import { ApplicantComparisonReport } from '../../types';

export const ApplicantComparisonView: React.FC = () => {
  const {
    applicants,
    selectedForComparison,
    toggleCompareSelection,
    clearComparison,
    selectApplicant,
  } = useApp();

  const [report, setReport] = useState<ApplicantComparisonReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const comparedApplicants = applicants.filter(a => selectedForComparison.includes(a.id));
  const comparisonKey = selectedForComparison.sort().join(',');

  useEffect(() => {
    let isCurrent = true;
    if (comparedApplicants.length >= 2) {
      setIsLoading(true);
      generateApplicantComparisonReport(comparedApplicants)
        .then(res => {
          if (isCurrent) {
            setReport(res);
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.warn('Comparison error:', err);
          if (isCurrent) {
            setIsLoading(false);
          }
        });
    } else {
      setReport(null);
    }
    return () => {
      isCurrent = false;
    };
  }, [comparisonKey]);

  if (comparedApplicants.length < 2) {
    return (
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 max-w-xl mx-auto shadow-sm animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Users2 className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
          Side-by-Side Applicant Comparator
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Please select <strong>at least 2 candidates</strong> (up to 4) from the directory below to compare academics, research publications, leadership, financial readiness, and AI synthesis.
        </p>

        {/* Quick Select Candidates */}
        <div className="mt-6 space-y-2 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Click to add candidates for comparison:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {applicants.map(app => (
              <button
                key={app.id}
                onClick={() => toggleCompareSelection(app.id)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <div className="truncate pr-2">
                  <p className="truncate">{app.firstName} {app.lastName}</p>
                  <span className="text-[10px] text-slate-400 font-normal">{app.countryOfOrigin} • GPA {app.normalizedGPA || 3.8}</span>
                </div>
                <UserPlus className="w-4 h-4 text-indigo-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Transform Radar Data for Recharts
  const RADAR_DIMENSIONS = [
    { key: 'academics', label: 'Academics & Rigor' },
    { key: 'research', label: 'Research & Publications' },
    { key: 'leadership', label: 'Leadership & Extracurricular' },
    { key: 'projects', label: 'Technical Projects' },
    { key: 'financials', label: 'Financial Readiness' },
    { key: 'sopAlignment', label: 'SOP & University Fit' },
    { key: 'englishProficiency', label: 'English Mastery' },
  ];

  const radarChartData = RADAR_DIMENSIONS.map(dim => {
    const point: Record<string, any> = { dimension: dim.label };
    report?.radarScores.forEach(score => {
      point[score.applicantName] = (score as any)[dim.key] || 75;
    });
    return point;
  });

  const RADAR_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-600" />
            <span>Comparing {comparedApplicants.length} International Candidates</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Holistic multidimensional benchmarking and committee tradeoff synthesis
          </p>
        </div>

        {/* Selected Candidate Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {comparedApplicants.map((app, idx) => (
            <div
              key={app.id}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: RADAR_COLORS[idx % RADAR_COLORS.length] }}
              />
              <span>{app.firstName} {app.lastName}</span>
              <button
                onClick={() => toggleCompareSelection(app.id)}
                className="text-slate-400 hover:text-rose-500 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={clearComparison}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline ml-2"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Radar Chart & High-Level Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Multi-Dimensional Competency Radar
              </h3>
              <p className="text-xs text-slate-500">Benchmark across 7 core admissions criteria (0-100)</p>
            </div>
          </div>

          <div className="h-80 flex items-center justify-center">
            {isLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Computing comparative dimensions...</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="#64748b" opacity={0.2} />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9.5, fill: '#94a3b8' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  {comparedApplicants.map((app, idx) => (
                    <Radar
                      key={app.id}
                      name={`${app.firstName} ${app.lastName}`}
                      dataKey={`${app.firstName} ${app.lastName}`}
                      stroke={RADAR_COLORS[idx % RADAR_COLORS.length]}
                      fill={RADAR_COLORS[idx % RADAR_COLORS.length]}
                      fillOpacity={0.2}
                    />
                  ))}
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
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* AI Comparative Synthesis Narrative */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  AI Committee Comparative Synthesis
                </h3>
                <p className="text-[11px] text-slate-500">Cross-dossier trade-off analysis and lab match</p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                <p>Generating LLM comparative synthesis narrative...</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-200 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-line prose dark:prose-invert prose-xs">
                {report?.aiSynthesis || 'No comparative synthesis available.'}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Evidence cross-referenced across all {comparedApplicants.length} applicant files
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Side-by-Side Detailed Attribute Matrix
          </h3>
          <p className="text-xs text-slate-500">Direct parameter-by-parameter comparative breakdown</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-60">Admissions Dimension</th>
                {comparedApplicants.map((app, idx) => (
                  <th key={app.id} className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: RADAR_COLORS[idx % RADAR_COLORS.length] }}
                      />
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        {app.firstName} {app.lastName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">{app.countryOfOrigin}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {report?.comparisonMetrics.map((metric, mi) => (
                <tr key={mi} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30">
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-900/30">
                    <span className="text-[10px] text-slate-400 block uppercase">{metric.category}</span>
                    {metric.metric}
                  </td>
                  {comparedApplicants.map(app => (
                    <td key={app.id} className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                      {metric.values[app.id] !== undefined ? String(metric.values[app.id]) : 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer Actions */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-end gap-3">
          {comparedApplicants.map(app => (
            <button
              key={app.id}
              onClick={() => selectApplicant(app.id, 'APPLICANT_DETAIL')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>View {app.firstName}'s Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
