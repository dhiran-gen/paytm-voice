// Multi-Agent Coordinator & Execution Orchestrator

import { Applicant, ApplicationStatus } from '../../types';
import { runAcademicAgent } from './academicAgent';
import { runFinancialAgent } from './financialAgent';
import { buildApplicantKnowledgeGraph } from './knowledgeGraphBuilder';
import { runReasoningAgent } from './reasoningAgent';
import { runRecommendationAgent } from './recommendationAgent';
import { runResumeAgent } from './resumeAgent';
import { runRiskAgent } from './riskAgent';
import { runSOPAgent } from './sopAgent';

export type AgentName = 
  | 'Academic Intelligence'
  | 'SOP Intelligence'
  | 'Resume Intelligence'
  | 'Recommendation Intelligence'
  | 'Financial Intelligence'
  | 'Risk & Anomaly Detection'
  | 'Synthesis & Reasoning';

export interface OrchestrationEvent {
  agentName: AgentName;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'ERROR';
  progress: number;
  message: string;
}

export async function runFullApplicantAnalysis(
  applicant: Applicant,
  onEvent?: (event: OrchestrationEvent) => void
): Promise<Applicant> {
  const updatedApplicant: Applicant = {
    ...applicant,
    status: 'UNDER_AI_REVIEW' as ApplicationStatus,
  };

  // 1. Run Agents 1-6 concurrently
  onEvent?.({
    agentName: 'Academic Intelligence',
    status: 'RUNNING',
    progress: 10,
    message: 'Analyzing normalized GPA, semester grade trajectory, and core prerequisites...'
  });
  onEvent?.({
    agentName: 'SOP Intelligence',
    status: 'RUNNING',
    progress: 10,
    message: 'Evaluating motivation depth, writing quality, and faculty alignment...'
  });
  onEvent?.({
    agentName: 'Resume Intelligence',
    status: 'RUNNING',
    progress: 10,
    message: 'Extracting technical taxonomy, project impact, and publications...'
  });
  onEvent?.({
    agentName: 'Recommendation Intelligence',
    status: 'RUNNING',
    progress: 10,
    message: 'Scrutinizing recommender credibility and percentile benchmarks...'
  });
  onEvent?.({
    agentName: 'Financial Intelligence',
    status: 'RUNNING',
    progress: 10,
    message: 'Calculating 1-year COA liquid funding vs university requirements...'
  });
  onEvent?.({
    agentName: 'Risk & Anomaly Detection',
    status: 'RUNNING',
    progress: 10,
    message: 'Auditing cross-document consistency and checking missing files...'
  });

  const [
    academicResult,
    sopResult,
    resumeResult,
    recommendationResult,
    financialResult,
    riskResult
  ] = await Promise.all([
    runAcademicAgent(applicant).then(res => {
      onEvent?.({ agentName: 'Academic Intelligence', status: 'COMPLETED', progress: 100, message: `Academic score: ${res.score}/100 (GPA: ${res.normalizedGPA}/4.0)` });
      return res;
    }),
    runSOPAgent(applicant).then(res => {
      onEvent?.({ agentName: 'SOP Intelligence', status: 'COMPLETED', progress: 100, message: `SOP alignment score: ${res.score}/100` });
      return res;
    }),
    runResumeAgent(applicant).then(res => {
      onEvent?.({ agentName: 'Resume Intelligence', status: 'COMPLETED', progress: 100, message: `Extracted ${res.technicalSkills.programmingLanguages.length} languages & ${res.projects.length} verified projects` });
      return res;
    }),
    runRecommendationAgent(applicant).then(res => {
      onEvent?.({ agentName: 'Recommendation Intelligence', status: 'COMPLETED', progress: 100, message: `Analyzed ${res.recommenders.length} recommenders (Score: ${res.score}/100)` });
      return res;
    }),
    runFinancialAgent(applicant).then(res => {
      onEvent?.({ agentName: 'Financial Intelligence', status: 'COMPLETED', progress: 100, message: `Verified $${res.totalVerifiedLiquidFundsUSD.toLocaleString()} USD (${res.readinessStatus})` });
      return res;
    }),
    runRiskAgent(applicant).then(res => {
      onEvent?.({ agentName: 'Risk & Anomaly Detection', status: 'COMPLETED', progress: 100, message: `Audit completed: ${res.overallRiskLevel} risk level (${res.flaggedRisks.length} flagged items)` });
      return res;
    }),
  ]);

  // 2. Run Agent 7: Synthesis & Reasoning
  onEvent?.({
    agentName: 'Synthesis & Reasoning',
    status: 'RUNNING',
    progress: 70,
    message: 'Synthesizing all 6 intelligence agents into an explainable recommendation...'
  });

  const reasoningResult = await runReasoningAgent(
    applicant,
    academicResult,
    sopResult,
    resumeResult,
    recommendationResult,
    financialResult,
    riskResult
  );

  onEvent?.({
    agentName: 'Synthesis & Reasoning',
    status: 'COMPLETED',
    progress: 100,
    message: `Final Recommendation: ${reasoningResult.overallRecommendation} (${reasoningResult.confidenceScore}% confidence)`
  });

  // 3. Attach all agent results and generate Knowledge Graph
  updatedApplicant.academicAnalysis = academicResult;
  updatedApplicant.sopAnalysis = sopResult;
  updatedApplicant.resumeAnalysis = resumeResult;
  updatedApplicant.recommendationAnalysis = recommendationResult;
  updatedApplicant.financialAnalysis = financialResult;
  updatedApplicant.riskAnalysis = riskResult;
  updatedApplicant.reasoningResult = reasoningResult;
  updatedApplicant.knowledgeGraph = buildApplicantKnowledgeGraph(updatedApplicant);
  updatedApplicant.lastAnalyzedAt = new Date().toISOString();

  // 4. Update application status
  if (reasoningResult.overallRecommendation === 'INTERVIEW_RECOMMENDED') {
    updatedApplicant.status = 'INTERVIEW_RECOMMENDED';
  } else if (reasoningResult.overallRecommendation === 'FINANCIAL_REVIEW_REQUIRED') {
    updatedApplicant.status = 'FINANCIAL_REVIEW_REQUIRED';
  } else {
    updatedApplicant.status = 'REVIEW_COMPLETED';
  }

  return updatedApplicant;
}
