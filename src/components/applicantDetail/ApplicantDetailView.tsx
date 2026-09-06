// Comprehensive Applicant Dossier Hub & Multi-Agent Intelligence Center

import {
  AlertTriangle,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle2,
  DollarSign,
  FileText,
  GraduationCap,
  HelpCircle,
  Layers,
  Loader2,
  MessageSquare,
  Network,
  Printer,
  Sparkles,
  Star,
  Upload,
  UserCheck
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HumanDecisionType } from '../../types';
import { ChatWithApplication } from '../chat/ChatWithApplication';
import { KnowledgeGraphViewer } from '../knowledgeGraph/KnowledgeGraphViewer';
import { ApplicantReportView } from '../report/ApplicantReportView';

export type DossierTab =
  | 'OVERVIEW'
  | 'AGENTS'
  | 'DOCUMENTS'
  | 'KNOWLEDGE_GRAPH'
  | 'CHAT'
  | 'REPORT'
  | 'DECISION';

export const ApplicantDetailView: React.FC = () => {
  const {
    activeApplicant,
    runAnalysisForApplicant,
    isAnalyzing,
    analysisEvents,
    updateApplicantDecision,
    toggleFavorite,
    uploadDocumentsForApplicant,
  } = useApp();

  const applicant = activeApplicant;
  const [dossierTab, setDossierTab] = useState<DossierTab>('OVERVIEW');
  const [selectedAgentIndex, setSelectedAgentIndex] = useState<number>(0);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Human decision form state
  const [decisionType, setDecisionType] = useState<HumanDecisionType>(applicant?.humanDecision?.decision || 'PENDING');
  const [officerName, setOfficerName] = useState<string>(applicant?.humanDecision?.officerName || 'Admissions Officer');
  const [decisionNotes, setDecisionNotes] = useState<string>(applicant?.humanDecision?.notes || '');
  const [scholarshipAmount, setScholarshipAmount] = useState<number>(applicant?.humanDecision?.scholarshipRecommendedUSD || 0);

  if (!applicant) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p>No applicant selected. Please choose a candidate from the directory.</p>
      </div>
    );
  }

  const activeDoc = applicant.documents.find(d => d.id === (selectedDocumentId || applicant.documents[0]?.id)) || applicant.documents[0];

  const handleSaveDecision = () => {
    updateApplicantDecision(applicant.id, {
      decision: decisionType,
      officerName,
      officerRole: 'Senior Admissions Evaluator',
      timestamp: new Date().toISOString(),
      notes: decisionNotes,
      scholarshipRecommendedUSD: scholarshipAmount,
    });
    alert('Human admissions decision successfully recorded and locked.');
  };

  const handleDocumentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadDocumentsForApplicant(applicant.id, Array.from(e.target.files));
      alert('Document uploaded and indexed successfully!');
    }
  };

  const rec = applicant.reasoningResult?.overallRecommendation || 'RECOMMEND_ADMIT';
  const conf = applicant.reasoningResult?.confidenceScore || 90;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Top Header Profile Banner */}
      <div className="bg-white dark:bg-slate-800/95 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Candidate Profile Avatar & Bio */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              {applicant.firstName[0]}{applicant.lastName[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {applicant.firstName} {applicant.lastName}
                </h1>
                <button
                  onClick={() => toggleFavorite(applicant.id)}
                  className={`p-1 rounded-lg transition-colors ${
                    applicant.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-400'
                  }`}
                  title="Toggle Favorite"
                >
                  <Star className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {applicant.applicationNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {applicant.countryOfOrigin}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{applicant.targetProgram}</span>
                <span className="text-slate-400">&bull;</span>
                <span>{applicant.targetSpecialization || 'General Track'}</span>
                <span className="text-slate-400">&bull;</span>
                <span>Term: <strong className="text-slate-800 dark:text-slate-200">{applicant.targetTerm}</strong></span>
                <span className="text-slate-400">&bull;</span>
                <span>Undergrad: <strong className="text-slate-800 dark:text-slate-200">{applicant.undergraduateInstitution}</strong></span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={() => runAnalysisForApplicant(applicant.id)}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-102 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing (7 Agents)...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Run Multi-Agent Analysis</span>
                </>
              )}
            </button>

            <button
              onClick={() => setDossierTab('DECISION')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Human Decision</span>
            </button>

            <button
              onClick={() => setDossierTab('REPORT')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
              title="View Printable Committee Report"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Multi-Agent Running Banner */}
        {isAnalyzing && (
          <div className="mt-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                Multi-Agent Cognitive Reasoning in Progress...
              </span>
              <span>7 Specialized AI Agents Active</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                'Academic Intelligence',
                'SOP Intelligence',
                'Resume Intelligence',
                'Recommendation Intelligence',
                'Financial Intelligence',
                'Risk Detection',
                'Synthesis Reasoning'
              ].map((agentName, idx) => {
                const event = analysisEvents.find(e => e.agentName.includes(agentName.split(' ')[0]));
                const isDone = event?.status === 'COMPLETED';
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl border text-[10px] font-medium transition-all ${
                      isDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-indigo-100/60 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 animate-pulse'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                      <span className="truncate">{agentName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Dossier Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        {[
          { id: 'OVERVIEW', label: 'AI Intelligence Overview', icon: Sparkles },
          { id: 'AGENTS', label: 'Multi-Agent Deep Dive (7)', icon: Brain },
          { id: 'DOCUMENTS', label: `Document Intelligence & OCR (${applicant.documents.length})`, icon: Layers },
          { id: 'KNOWLEDGE_GRAPH', label: 'Interactive Knowledge Graph', icon: Network },
          { id: 'CHAT', label: 'Chat with Application', icon: MessageSquare },
          { id: 'REPORT', label: 'Printable Committee Dossier', icon: FileText },
          { id: 'DECISION', label: 'Human Sign-off & Audit', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = dossierTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setDossierTab(tab.id as DossierTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: OVERVIEW */}
      {dossierTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Recommendation & Confidence Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-sm md:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block mb-1">
                  Overall Explainable AI Recommendation
                </span>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {rec.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {applicant.reasoningResult?.executiveSummary || 'Holistic cross-document synthesis completed.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Evaluated by Reasoning Agent #7</span>
                <span className="text-emerald-400 font-bold">Traceable Source Grounding</span>
              </div>
            </div>

            {/* Confidence & Risk Score */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Model Confidence Metric
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{conf}%</span>
                  <span className="text-xs text-slate-500 font-semibold">High Confidence</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${conf}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">Risk Assessment:</span>
                <span className={`font-bold ${
                  applicant.riskAnalysis?.overallRiskLevel === 'LOW' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {applicant.riskAnalysis?.overallRiskLevel || 'LOW'} RISK
                </span>
              </div>
            </div>
          </div>

          {/* Core Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Strengths */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Core Strengths</span>
              </h3>
              <div className="space-y-3">
                {applicant.reasoningResult?.coreStrengths.map((str, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{str.title}</p>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{str.description}</p>
                    {str.evidence && (
                      <div className="mt-2 pt-2 border-t border-emerald-200/40 dark:border-emerald-800/40 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                        <FileText className="w-3 h-3" />
                        <span className="truncate">{str.evidence.documentName}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Core Weaknesses */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Areas of Growth & Mitigating Factors</span>
              </h3>
              <div className="space-y-3">
                {applicant.reasoningResult?.coreWeaknesses && applicant.reasoningResult.coreWeaknesses.length > 0 ? (
                  applicant.reasoningResult.coreWeaknesses.map((weak, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{weak.title}</p>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{weak.description}</p>
                      {weak.mitigatingFactors && (
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1.5 font-medium">
                          <strong>Mitigating Factor:</strong> {weak.mitigatingFactors}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 p-4">No critical weaknesses detected across submitted documents.</p>
                )}
              </div>
            </div>
          </div>

          {/* Tailored Interview Questions Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span>Tailored Interview Questions for Committee</span>
              </h3>
              <button
                onClick={() => setDossierTab('CHAT')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ask More via Chat Copilot &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {applicant.reasoningResult?.tailoredInterviewQuestions.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 uppercase">
                      {q.category}
                    </span>
                    <span className="text-[10px] text-slate-400">Target: {q.targetToProbe}</span>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">&ldquo;{q.question}&rdquo;</p>
                  <p className="text-[10px] text-slate-500">{q.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: MULTI-AGENT DEEP DIVE */}
      {dossierTab === 'AGENTS' && (
        <div className="space-y-6">
          {/* Agent Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: 0, name: 'Academic Intelligence', icon: GraduationCap, score: applicant.academicAnalysis?.score },
              { id: 1, name: 'SOP Intelligence', icon: BookOpen, score: applicant.sopAnalysis?.score },
              { id: 2, name: 'Resume Intelligence', icon: Briefcase, score: applicant.resumeAnalysis?.score },
              { id: 3, name: 'Recommendation Intelligence', icon: UserCheck, score: applicant.recommendationAnalysis?.score },
              { id: 4, name: 'Financial Intelligence', icon: DollarSign, score: applicant.financialAnalysis?.score },
              { id: 5, name: 'Risk Detection', icon: AlertTriangle, score: applicant.riskAnalysis?.riskScore },
              { id: 6, name: 'Reasoning Synthesis', icon: Brain, score: applicant.reasoningResult?.confidenceScore },
            ].map(agent => {
              const Icon = agent.icon;
              const isSelected = selectedAgentIndex === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentIndex(agent.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className="w-4 h-4" />
                    {agent.score !== undefined && (
                      <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}>
                        {agent.score}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-xs leading-tight">{agent.name}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Agent Output Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
            {/* Agent 0: Academic Intelligence */}
            {selectedAgentIndex === 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Agent 1: Academic Intelligence</h3>
                    <p className="text-xs text-slate-500">Evaluates GPA normalization, core subject mastery, and semester grade trajectory</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono">
                    Score: {applicant.academicAnalysis?.score}/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Raw & Normalized GPA</span>
                    <p className="font-bold text-base text-slate-900 dark:text-white mt-0.5">{applicant.normalizedGPA}/4.0</p>
                    <span className="text-[10px] text-slate-500">Raw Scale: {applicant.rawGPA}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Semester Trajectory</span>
                    <p className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">{applicant.academicAnalysis?.trend?.replace(/_/g, ' ')}</p>
                    <span className="text-[10px] text-slate-500">{applicant.academicAnalysis?.trendDescription}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Backlogs & Retakes</span>
                    <p className="font-bold text-base text-slate-900 dark:text-white mt-0.5">{applicant.academicAnalysis?.backlogsOrRetakes || 0}</p>
                    <span className="text-[10px] text-slate-500">{applicant.academicAnalysis?.backlogDetails || 'No backlogs recorded'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase mb-2">Subject-Level Mastery Breakdown:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {applicant.academicAnalysis?.subjectBreakdown.map((s, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">{s.category}</span>
                        <p className="font-bold text-slate-900 dark:text-white truncate">{s.subject}</p>
                        <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">{s.grade} ({s.normalizedScore}/100)</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Agent 1: SOP Intelligence */}
            {selectedAgentIndex === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Agent 2: Statement of Purpose Intelligence</h3>
                    <p className="text-xs text-slate-500">Evaluates motivation depth, faculty fit, writing quality, and originality</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono">
                    Score: {applicant.sopAnalysis?.score}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Motivation Strength</span>
                    <p className="font-bold text-base text-slate-900 dark:text-white">{applicant.sopAnalysis?.motivationStrength}/100</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Writing Quality</span>
                    <p className="font-bold text-base text-slate-900 dark:text-white">{applicant.sopAnalysis?.writingQuality}/100</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Originality Score</span>
                    <p className="font-bold text-base text-slate-900 dark:text-white">{applicant.sopAnalysis?.originalityScore}/100</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Clarity Metric</span>
                    <p className="font-bold text-base text-slate-900 dark:text-white">{applicant.sopAnalysis?.clarityScore}/100</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 text-xs space-y-1.5">
                  <span className="font-bold text-purple-900 dark:text-purple-200 text-xs">University & Faculty Curricular Fit Analysis:</span>
                  <p className="text-purple-800 dark:text-purple-300 leading-relaxed">{applicant.sopAnalysis?.universityFitAnalysis}</p>
                </div>
              </div>
            )}

            {/* Agent 2: Resume Intelligence */}
            {selectedAgentIndex === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Agent 3: Resume & Professional Intelligence</h3>
                    <p className="text-xs text-slate-500">Extracts programming taxonomy, verified projects, internships, and publications</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono">
                    Score: {applicant.resumeAnalysis?.score}/100
                  </span>
                </div>

                {/* Technical Skills Taxonomy */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">Technical Skills Taxonomy:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.resumeAnalysis?.technicalSkills.programmingLanguages.map((lang, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                        {lang}
                      </span>
                    ))}
                    {applicant.resumeAnalysis?.technicalSkills.frameworksAndTools.map((tool, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">Verified Projects:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {applicant.resumeAnalysis?.projects.map((proj, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                        <p className="font-bold text-slate-900 dark:text-white">{proj.title}</p>
                        <p className="text-slate-600 dark:text-slate-400">{proj.description}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">Outcome: {proj.impactOrOutcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Agent 3: Recommendation Intelligence */}
            {selectedAgentIndex === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Agent 4: Recommendation Intelligence</h3>
                    <p className="text-xs text-slate-500">Evaluates faculty credibility, enthusiasm, and percentile rankings</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono">
                    Score: {applicant.recommendationAnalysis?.score}/100
                  </span>
                </div>

                <div className="space-y-3">
                  {applicant.recommendationAnalysis?.recommenders.map((recItem, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{recItem.name} ({recItem.designation})</span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px]">
                          {recItem.sentiment} &bull; {recItem.credibilityRating} CREDIBILITY
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{recItem.anecdoteSummary}</p>
                      {recItem.percentileClaim && (
                        <p className="text-blue-600 dark:text-blue-400 font-semibold font-mono text-[11px]">
                          Claim: &ldquo;{recItem.percentileClaim}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agent 4: Financial Intelligence */}
            {selectedAgentIndex === 4 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Agent 5: Financial Intelligence</h3>
                    <p className="text-xs text-slate-500">Evaluates liquid funding versus university Cost of Attendance (COA)</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono">
                    Score: {applicant.financialAnalysis?.score}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">1-Year COA</span>
                    <p className="font-bold text-base text-slate-900 dark:text-white">${applicant.financialAnalysis?.estimatedCostOfAttendance1Year.toLocaleString()} USD</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Verified Liquid Assets</span>
                    <p className="font-bold text-base text-emerald-600 dark:text-emerald-400">${applicant.financialAnalysis?.totalVerifiedLiquidFundsUSD.toLocaleString()} USD</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Funding Gap</span>
                    <p className="font-bold text-base text-slate-900 dark:text-white">${applicant.financialAnalysis?.fundingGapUSD.toLocaleString()} USD</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Readiness Status</span>
                    <p className="font-bold text-xs text-slate-900 dark:text-white mt-1">{applicant.financialAnalysis?.readinessStatus}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Agent 5: Risk & Anomaly Detection */}
            {selectedAgentIndex === 5 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Agent 6: Risk & Anomaly Detection</h3>
                    <p className="text-xs text-slate-500">Cross-audits claims across transcript, resume, SOP, and financial documents</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-mono">
                    Risk Level: {applicant.riskAnalysis?.overallRiskLevel}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-900 dark:text-white uppercase block mb-1">Consistency Audit Narrative:</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{applicant.riskAnalysis?.inconsistencyAudit}</p>
                </div>

                {applicant.riskAnalysis?.flaggedRisks && applicant.riskAnalysis.flaggedRisks.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">Flagged Risk Items:</span>
                    {applicant.riskAnalysis.flaggedRisks.map((riskItem, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-200">
                          <span>{riskItem.title}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-md bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                            {riskItem.severity} SEVERITY
                          </span>
                        </div>
                        <p className="text-rose-800 dark:text-rose-300">{riskItem.description}</p>
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Action: {riskItem.suggestedAction}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Zero critical discrepancies detected across application files.
                  </p>
                )}
              </div>
            )}

            {/* Agent 6: Reasoning Synthesis */}
            {selectedAgentIndex === 6 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Agent 7: Lead Reasoning & Synthesis</h3>
                    <p className="text-xs text-slate-500">Holistic multi-agent synthesis and committee briefing</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono">
                    Confidence: {applicant.reasoningResult?.confidenceScore}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white uppercase block">Cross-Document Synergy Analysis:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{applicant.reasoningResult?.crossDocumentSynergyAnalysis}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 3: DOCUMENT INTELLIGENCE & OCR HUB */}
      {dossierTab === 'DOCUMENTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Document File Selector */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Uploaded Documents</h3>
              <label className="cursor-pointer px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                <Upload className="w-3 h-3" />
                <span>Add Doc</span>
                <input type="file" multiple onChange={handleDocumentFileUpload} className="hidden" />
              </label>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {applicant.documents.map(doc => {
                const isSelected = doc.id === activeDoc?.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocumentId(doc.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 ring-1 ring-blue-500/20'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{doc.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Type: {doc.type} &bull; {doc.chunks?.length || 1} Chunks
                      </span>
                    </div>

                    {doc.ocrApplied && (
                      <span className="px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-bold shrink-0">
                        OCR {doc.ocrConfidence ? `${doc.ocrConfidence}%` : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Extracted Text & Chunk Inspector */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            {activeDoc ? (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{activeDoc.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      Category: {activeDoc.type} &bull; {Math.round(activeDoc.fileSize / 1024)} KB &bull; Ingested: {new Date(activeDoc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {activeDoc.ocrApplied && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Multimodal OCR Ingested
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 max-h-[420px] overflow-y-auto font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {activeDoc.extractedText || 'No text extracted for this document.'}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select a document to inspect extracted content.</p>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB 4: KNOWLEDGE GRAPH */}
      {dossierTab === 'KNOWLEDGE_GRAPH' && applicant.knowledgeGraph && (
        <KnowledgeGraphViewer
          graphData={applicant.knowledgeGraph}
          applicantName={`${applicant.firstName} ${applicant.lastName}`}
        />
      )}

      {/* 7. TAB 5: CHAT WITH APPLICATION */}
      {dossierTab === 'CHAT' && (
        <ChatWithApplication
          applicant={applicant}
          onOpenDocument={() => setDossierTab('DOCUMENTS')}
        />
      )}

      {/* 8. TAB 6: PRINTABLE COMMITTEE DOSSIER */}
      {dossierTab === 'REPORT' && (
        <ApplicantReportView applicant={applicant} />
      )}

      {/* 9. TAB 7: HUMAN DECISION & COMMITTEE SIGN-OFF */}
      {dossierTab === 'DECISION' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Official Human Admissions Decision Record</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Record final binding decision for {applicant.firstName} {applicant.lastName}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Admissions Decision
              </label>
              <select
                value={decisionType}
                onChange={e => setDecisionType(e.target.value as HumanDecisionType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
              >
                <option value="PENDING">Pending Committee Review</option>
                <option value="ADMIT">Admit (Full Offer)</option>
                <option value="CONDITIONAL_ADMIT">Conditional Admit (English/Prerequisite bridge)</option>
                <option value="INTERVIEW">Schedule Faculty Technical Interview</option>
                <option value="WAITLIST">Waitlist for Second Round</option>
                <option value="REQUEST_MORE_INFO">Request Additional Documents</option>
                <option value="REJECT">Deny Admission</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Merit Scholarship Recommended (USD)
              </label>
              <input
                type="number"
                step="1000"
                value={scholarshipAmount}
                onChange={e => setScholarshipAmount(parseInt(e.target.value) || 0)}
                placeholder="e.g. 10000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Admissions Officer Name
              </label>
              <input
                type="text"
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Officer Deliberation & Rationale Notes
              </label>
              <textarea
                rows={4}
                value={decisionNotes}
                onChange={e => setDecisionNotes(e.target.value)}
                placeholder="Document specific rationale, faculty advisor endorsement notes, and financial checks..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <button
              onClick={handleSaveDecision}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/30 transition-all hover:scale-102"
            >
              Sign & Lock Official Admissions Decision
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
