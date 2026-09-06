// Natural Language Semantic Vector Search Hub

import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  Sparkles
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { searchAllApplicants } from '../../services/vectorStore';
import { Applicant } from '../../types';

export const SemanticSearchView: React.FC = () => {
  const { applicants, selectApplicant } = useApp();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<{ applicant: Applicant; score: number; bestSnippet: string; matchedDocs: string[] }[]>([]);

  const sampleQueries = [
    'Find students interested in Machine Learning',
    'Find applicants with research papers and publications',
    'Find applicants with IELTS above 8.0',
    'Find applicants needing financial assistance or with funding gaps',
    'Find candidates from top universities with robotics experience',
    'Find software engineers with cloud and distributed systems background'
  ];

  const handleSearch = (qToSend?: string) => {
    const text = qToSend !== undefined ? qToSend : query;
    if (!text.trim()) return;

    if (qToSend !== undefined) {
      setQuery(qToSend);
    }

    setHasSearched(true);
    const matched = searchAllApplicants(applicants, text, 10);
    setResults(matched);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vector Database & Semantic Indexing</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Natural Language Semantic Candidate Discovery
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Search across complete student dossiers, transcripts, SOPs, and recommendation letters using concept-based vector similarity instead of rigid keywords.
        </p>
      </div>

      {/* Search Bar Input */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 shadow-lg border border-slate-200 dark:border-slate-700">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Find applicants with published IEEE papers and high GPA..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-0"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-2xl shadow-xs shadow-blue-500/30 transition-all hover:scale-102 active:scale-98 flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Semantic Search</span>
          </button>
        </form>
      </div>

      {/* Suggested Natural Language Queries */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Try Natural Language Examples:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(sample)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 text-xs font-medium transition-all shadow-2xs text-left"
            >
              &ldquo;{sample}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Feed */}
      {hasSearched && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Semantic Search Results ({results.length} Matches)
            </h3>
            <span className="text-xs text-slate-500">Ranked by Cosine Vector Proximity</span>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500">No applicants strongly match this specific semantic criteria.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(({ applicant, score, bestSnippet, matchedDocs }) => {
                const matchPct = Math.round(score * 100);
                const rec = applicant.reasoningResult?.overallRecommendation || 'RECOMMEND_ADMIT';

                return (
                  <div
                    key={applicant.id}
                    className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                          {applicant.firstName[0]}{applicant.lastName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              {applicant.firstName} {applicant.lastName}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({applicant.applicationNumber})
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {applicant.targetProgram} &bull; {applicant.countryOfOrigin} &bull; {applicant.undergraduateInstitution}
                          </p>
                        </div>
                      </div>

                      {/* Score Badge & Recommendation */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {matchPct}% Match
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {rec.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Matched Snippet Callout */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Relevant Excerpt from Document Chunks:
                      </span>
                      <p className="italic text-slate-800 dark:text-slate-200 leading-relaxed">
                        &ldquo;{bestSnippet}&rdquo;
                      </p>
                    </div>

                    {/* Matched Documents & Action */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-750 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Grounded in:</span>
                        {matchedDocs.map((doc, di) => (
                          <span
                            key={di}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <FileText className="w-2.5 h-2.5 text-blue-500" />
                            {doc}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => selectApplicant(applicant.id, 'APPLICANT_DETAIL')}
                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Open Complete Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
