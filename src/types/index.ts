// Type definitions for Admission Intelligence Platform

export type UserRole = 'ADMISSION_OFFICER' | 'APPLICANT';

export type ApplicationStatus = 
  | 'DRAFT'
  | 'DOCUMENTS_INGESTED'
  | 'UNDER_AI_REVIEW'
  | 'REVIEW_COMPLETED'
  | 'INTERVIEW_RECOMMENDED'
  | 'FINANCIAL_REVIEW_REQUIRED'
  | 'OFFICER_DECIDED';

export type HumanDecisionType = 
  | 'PENDING'
  | 'ADMIT'
  | 'CONDITIONAL_ADMIT'
  | 'WAITLIST'
  | 'REJECT'
  | 'INTERVIEW'
  | 'REQUEST_MORE_INFO';

export type DocumentType = 
  | 'TRANSCRIPT'
  | 'SOP'
  | 'RESUME'
  | 'LOR'
  | 'IELTS_TOEFL'
  | 'CERTIFICATE'
  | 'WORK_EXP'
  | 'FINANCIAL'
  | 'PASSPORT'
  | 'OTHER';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RecommendationTier = 
  | 'STRONGLY_RECOMMEND_ADMIT'
  | 'RECOMMEND_ADMIT'
  | 'CONDITIONAL_ADMIT'
  | 'INTERVIEW_RECOMMENDED'
  | 'FINANCIAL_REVIEW_REQUIRED'
  | 'HIGH_RISK_DENY';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentType: DocumentType;
  documentName: string;
  chunkIndex: number;
  content: string;
  pageNumber?: number;
  embedding?: number[];
}

export interface ApplicationDocument {
  id: string;
  applicantId: string;
  name: string;
  type: DocumentType;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  extractedText: string;
  ocrApplied: boolean;
  ocrConfidence?: number;
  pageCount?: number;
  chunks: DocumentChunk[];
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  errorMessage?: string;
  metadata?: Record<string, any>;
}

// ----------------------------------------------------
// AI AGENT OUTPUT INTERFACES
// ----------------------------------------------------

export interface EvidenceCitation {
  id: string;
  documentId: string;
  documentName: string;
  documentType: DocumentType;
  snippet: string;
  pageNumber?: number;
  contextNote?: string;
}

export interface SubjectGrade {
  subject: string;
  grade: string;
  normalizedScore: number; // 0-100
  category: 'CORE_CS' | 'MATH' | 'AI_ML' | 'ELECTIVE' | 'OTHER';
  isStrength: boolean;
}

export interface AcademicAgentResult {
  score: number; // 0-100
  rawGPA: string; // e.g. "9.3/10" or "3.8/4.0"
  normalizedGPA: number; // normalized to 4.0 scale
  gradingSystem: string;
  trend: 'CONSISTENTLY_HIGH' | 'UPWARD_TRAJECTORY' | 'DOWNWARD_TRAJECTORY' | 'MODERATE_FLUCTUATING';
  trendDescription: string;
  backlogsOrRetakes: number;
  backlogDetails?: string;
  researchCourseworkReadiness: number; // 0-100
  subjectBreakdown: SubjectGrade[];
  academicConsistency: string;
  strengths: string[];
  weaknesses: string[];
  evidence: EvidenceCitation[];
}

export interface SOPAgentResult {
  score: number; // 0-100
  motivationStrength: number; // 0-100
  writingQuality: number; // 0-100
  originalityScore: number; // 0-100
  clarityScore: number; // 0-100
  careerGoalClarity: string;
  universityFitAnalysis: string;
  researchInterests: string[];
  crossValidationWithBackground: string;
  strengths: string[];
  weaknesses: string[];
  evidence: EvidenceCitation[];
}

export interface ResumeAgentResult {
  score: number; // 0-100
  technicalSkills: {
    programmingLanguages: string[];
    frameworksAndTools: string[];
    specializations: string[];
  };
  softSkills: string[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    impactOrOutcome: string;
    verifiedInOtherDocs: boolean;
  }[];
  internshipsAndWork: {
    role: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }[];
  publications: {
    title: string;
    venueOrConference: string;
    year: string;
    status: 'PUBLISHED' | 'UNDER_REVIEW' | 'PREPRINT';
  }[];
  leadershipRoles: string[];
  strengths: string[];
  weaknesses: string[];
  evidence: EvidenceCitation[];
}

export interface RecommenderProfile {
  name: string;
  designation: string;
  institution: string;
  relationship: string;
  durationKnown: string;
  sentiment: 'ENTHUSIASTIC' | 'POSITIVE' | 'NEUTRAL' | 'RESERVED';
  credibilityRating: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'UNCLEAR';
  keyEndorsements: string[];
  percentileClaim?: string; // e.g. "Top 2% of students I have taught"
  anecdoteSummary: string;
}

export interface RecommendationAgentResult {
  score: number; // 0-100
  leadershipRating: number; // 0-100
  teamworkRating: number; // 0-100
  communicationRating: number; // 0-100
  researchPotentialRating: number; // 0-100
  recommenders: RecommenderProfile[];
  recommenderConsistency: string;
  strengths: string[];
  weaknessesOrConcerns: string[];
  evidence: EvidenceCitation[];
}

export interface FinancialAgentResult {
  score: number; // 0-100
  readinessStatus: 'FULLY_FUNDED' | 'PARTIAL_GAP' | 'DEFICIT' | 'REVIEW_NEEDED';
  estimatedCostOfAttendance1Year: number; // USD
  estimatedCostOfAttendance2Year: number; // USD
  totalVerifiedLiquidFundsUSD: number;
  fundingGapUSD: number;
  sourcesOfFunding: {
    sourceType: 'BANK_DEPOSIT' | 'EDUCATION_LOAN' | 'SCHOLARSHIP' | 'SPONSOR_AFFIDAVIT' | 'OTHER';
    amountUSD: number;
    sponsorRelationship: string;
    verificationStatus: 'VERIFIED' | 'NEEDS_ORIGINAL' | 'UNVERIFIED';
    documentName: string;
  }[];
  missingFinancialDocuments: string[];
  financialReviewRequired: boolean;
  recommendations: string[];
  evidence: EvidenceCitation[];
}

export interface FlaggedRisk {
  id: string;
  severity: RiskLevel;
  category: 'DISCREPANCY' | 'MISSING_DOC' | 'SUSPICIOUS_CONTENT' | 'LOW_CONFIDENCE' | 'DUPLICATE' | 'ACADEMIC_ANOMALY';
  title: string;
  description: string;
  involvedDocuments: string[];
  suggestedAction: string;
}

export interface RiskAgentResult {
  overallRiskLevel: RiskLevel;
  riskScore: number; // 0-100 (higher = safer, lower = riskier)
  flaggedRisks: FlaggedRisk[];
  missingMandatoryDocuments: DocumentType[];
  inconsistencyAudit: string;
  evidence: EvidenceCitation[];
}

export interface ReasoningAgentResult {
  overallRecommendation: RecommendationTier;
  confidenceScore: number; // percentage 0-100
  executiveSummary: string;
  comprehensiveProfileSummary: string;
  crossDocumentSynergyAnalysis: string;
  coreStrengths: {
    title: string;
    description: string;
    supportingAgents: string[];
    evidence: EvidenceCitation;
  }[];
  coreWeaknesses: {
    title: string;
    description: string;
    mitigatingFactors?: string;
    evidence?: EvidenceCitation;
  }[];
  tailoredInterviewQuestions: {
    category: 'ACADEMIC' | 'TECHNICAL' | 'SOP_ALIGNMENT' | 'GAP_VERIFICATION' | 'LEADERSHIP';
    question: string;
    rationale: string;
    targetToProbe: string;
  }[];
  admissionCommitteeTalkingPoints: string[];
}

// ----------------------------------------------------
// KNOWLEDGE GRAPH INTERFACES
// ----------------------------------------------------

export type KGNodeType = 
  | 'STUDENT'
  | 'SKILL'
  | 'PROJECT'
  | 'SUBJECT'
  | 'CERTIFICATE'
  | 'CAREER_GOAL'
  | 'RESEARCH_INTEREST'
  | 'LEADERSHIP'
  | 'EXPERIENCE'
  | 'RECOMMENDER'
  | 'FINANCIAL_SPONSOR';

export interface KGNode {
  id: string;
  label: string;
  type: KGNodeType;
  subLabel?: string;
  category?: string;
  verifiedInDoc?: string;
  confidence?: number;
  x?: number;
  y?: number;
}

export interface KGEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  weight?: number;
  documentCitation?: string;
}

export interface KnowledgeGraphData {
  nodes: KGNode[];
  edges: KGEdge[];
}

// ----------------------------------------------------
// APPLICANT & HUMAN DECISION INTERFACES
// ----------------------------------------------------

export interface HumanDecisionRecord {
  decision: HumanDecisionType;
  officerName: string;
  officerRole: string;
  timestamp: string;
  notes: string;
  scholarshipRecommendedUSD?: number;
  conditionsOrPrerequisites?: string[];
  scheduledInterviewDate?: string;
}

export interface Applicant {
  id: string;
  applicationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  countryOfOrigin: string;
  nationality: string;
  passportNumber?: string;
  targetProgram: string; // e.g. "MS in Computer Science"
  targetSpecialization?: string; // e.g. "Artificial Intelligence"
  targetTerm: string; // e.g. "Fall 2026"
  targetDegreeLevel: 'MASTER' | 'PHD' | 'BACHELOR';
  appliedDate: string;
  status: ApplicationStatus;
  
  // High-level normalized metrics
  undergraduateInstitution: string;
  undergraduateMajor: string;
  rawGPA: string;
  normalizedGPA: number; // 4.0 scale
  englishProficiencyType: 'IELTS' | 'TOEFL' | 'DUOLINGO' | 'WAIVED';
  englishOverallScore: number;
  englishSubScores?: {
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
  };
  greScore?: {
    verbal: number;
    quant: number;
    awa: number;
  };

  // Documents
  documents: ApplicationDocument[];

  // Multi-Agent Results
  academicAnalysis?: AcademicAgentResult;
  sopAnalysis?: SOPAgentResult;
  resumeAnalysis?: ResumeAgentResult;
  recommendationAnalysis?: RecommendationAgentResult;
  financialAnalysis?: FinancialAgentResult;
  riskAnalysis?: RiskAgentResult;
  reasoningResult?: ReasoningAgentResult;

  // Knowledge Graph
  knowledgeGraph?: KnowledgeGraphData;

  // Human Reviewer Decision
  humanDecision?: HumanDecisionRecord;

  // Metadata
  lastAnalyzedAt?: string;
  isFavorite?: boolean;
  tags?: string[];
}

// ----------------------------------------------------
// CHAT & RAG INTERFACES
// ----------------------------------------------------

export interface ChatMessage {
  id: string;
  applicantId: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  timestamp: string;
  citations?: EvidenceCitation[];
  suggestedFollowUps?: string[];
  isStreaming?: boolean;
  agentName?: string;
}

// ----------------------------------------------------
// COMPARISON INTERFACES
// ----------------------------------------------------

export interface ApplicantComparisonMetric {
  metric: string;
  category: string;
  values: Record<string, string | number>; // applicantId -> value
  highestApplicantId?: string;
}

export interface ApplicantComparisonReport {
  applicantIds: string[];
  comparisonMetrics: ApplicantComparisonMetric[];
  aiSynthesis: string;
  radarScores: {
    applicantId: string;
    applicantName: string;
    academics: number;
    research: number;
    leadership: number;
    projects: number;
    financials: number;
    sopAlignment: number;
    englishProficiency: number;
  }[];
  cohortRecommendationSummary: string;
}

// ----------------------------------------------------
// CONFIG & SETTINGS
// ----------------------------------------------------

export interface LLMConfig {
  provider: 'GEMINI' | 'OPENAI' | 'CUSTOM_OPENAI';
  apiKey: string;
  geminiModel: 'gemini-2.0-flash' | 'gemini-1.5-pro' | 'gemini-1.5-flash';
  openaiModel: 'gpt-4o' | 'gpt-4o-mini';
  customEndpoint?: string;
  customModelName?: string;
  temperature: number;
  useFallbackIfKeyMissing: boolean;
}
