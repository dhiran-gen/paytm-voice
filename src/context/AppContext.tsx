// AppContext: Global Application State & Intelligence Coordination

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getEnrichedInitialApplicants } from '../data/mockApplicants';
import { OrchestrationEvent, runFullApplicantAnalysis } from '../services/agents/agentOrchestrator';
import { parseUploadedFile } from '../services/documentParser';
import { getStoredLLMConfig, saveLLMConfig } from '../services/llmService';
import { askApplicationQuestion } from '../services/ragService';
import {
  Applicant,
  ApplicationDocument,
  ChatMessage,
  HumanDecisionRecord,
  LLMConfig,
  UserRole
} from '../types';

export type MainNavigationTab = 
  | 'DASHBOARD'
  | 'APPLICATIONS'
  | 'APPLICANT_DETAIL'
  | 'COMPARE'
  | 'SEARCH'
  | 'REPORT'
  | 'PORTAL';

export interface AppContextType {
  applicants: Applicant[];
  activeApplicantId: string | null;
  activeApplicant: Applicant | null;
  activeTab: MainNavigationTab;
  userRole: UserRole;
  theme: 'light' | 'dark';
  selectedForComparison: string[];
  llmConfig: LLMConfig;
  isAnalyzing: boolean;
  analysisEvents: OrchestrationEvent[];
  chatMessages: Record<string, ChatMessage[]>;
  isApiKeyModalOpen: boolean;
  isNewApplicationModalOpen: boolean;

  // Actions
  setActiveTab: (tab: MainNavigationTab) => void;
  selectApplicant: (id: string, tab?: MainNavigationTab) => void;
  setUserRole: (role: UserRole) => void;
  toggleTheme: () => void;
  toggleCompareSelection: (id: string) => void;
  clearComparison: () => void;
  toggleFavorite: (id: string) => void;
  openApiKeyModal: () => void;
  closeApiKeyModal: () => void;
  openNewApplicationModal: () => void;
  closeNewApplicationModal: () => void;
  updateLLMConfig: (config: LLMConfig) => void;
  
  // Intelligence workflows
  runAnalysisForApplicant: (applicantId: string) => Promise<void>;
  updateApplicantDecision: (applicantId: string, decision: HumanDecisionRecord) => void;
  uploadDocumentsForApplicant: (applicantId: string, files: File[], onProgress?: (p: number, s: string) => void) => Promise<ApplicationDocument[]>;
  createNewApplication: (data: Partial<Applicant>, files: File[]) => Promise<string>;
  sendChatQuery: (applicantId: string, question: string) => Promise<void>;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const APPLICANTS_STORAGE_KEY = 'admission_intel_applicants_v1';
const THEME_STORAGE_KEY = 'admission_intel_theme';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    try {
      const saved = localStorage.getItem(APPLICANTS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved applicants, initializing default dataset:', e);
    }
    return getEnrichedInitialApplicants();
  });

  const [activeApplicantId, setActiveApplicantId] = useState<string | null>(() => {
    return applicants[0]?.id || null;
  });

  const [activeTab, setActiveTab] = useState<MainNavigationTab>('DASHBOARD');
  const [userRole, setUserRole] = useState<UserRole>('ADMISSION_OFFICER');
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return (saved as 'light' | 'dark') || 'light';
  });

  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(['app_ananya_sharma', 'app_chen_wei']);
  const [llmConfig, setLLMConfigState] = useState<LLMConfig>(getStoredLLMConfig());
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisEvents, setAnalysisEvents] = useState<OrchestrationEvent[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isNewApplicationModalOpen, setIsNewApplicationModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(APPLICANTS_STORAGE_KEY, JSON.stringify(applicants));
    } catch (e) {
      console.error('Failed to save applicants to localStorage:', e);
    }
  }, [applicants]);

  // Apply theme class to document body
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const activeApplicant = applicants.find(a => a.id === activeApplicantId) || applicants[0] || null;

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const selectApplicant = (id: string, tab: MainNavigationTab = 'APPLICANT_DETAIL') => {
    setActiveApplicantId(id);
    setActiveTab(tab);
  };

  const toggleCompareSelection = (id: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare up to 4 applicants simultaneously.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const clearComparison = () => {
    setSelectedForComparison([]);
  };

  const toggleFavorite = (id: string) => {
    setApplicants(prev => prev.map(app => {
      if (app.id === id) {
        return { ...app, isFavorite: !app.isFavorite };
      }
      return app;
    }));
  };

  const openApiKeyModal = () => setIsApiKeyModalOpen(true);
  const closeApiKeyModal = () => setIsApiKeyModalOpen(false);
  const openNewApplicationModal = () => setIsNewApplicationModalOpen(true);
  const closeNewApplicationModal = () => setIsNewApplicationModalOpen(false);

  const updateLLMConfig = (newConfig: LLMConfig) => {
    setLLMConfigState(newConfig);
    saveLLMConfig(newConfig);
  };

  const runAnalysisForApplicant = async (applicantId: string) => {
    const target = applicants.find(a => a.id === applicantId);
    if (!target) return;

    setIsAnalyzing(true);
    setAnalysisEvents([]);

    try {
      const enriched = await runFullApplicantAnalysis(target, (event) => {
        setAnalysisEvents(prev => {
          const filtered = prev.filter(e => e.agentName !== event.agentName);
          return [...filtered, event];
        });
      });

      setApplicants(prev => prev.map(a => a.id === applicantId ? enriched : a));
    } catch (err) {
      console.error('Multi-agent analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateApplicantDecision = (applicantId: string, decision: HumanDecisionRecord) => {
    setApplicants(prev => prev.map(app => {
      if (app.id === applicantId) {
        return {
          ...app,
          humanDecision: decision,
          status: 'OFFICER_DECIDED',
        };
      }
      return app;
    }));
  };

  const uploadDocumentsForApplicant = async (
    applicantId: string,
    files: File[],
    onProgress?: (p: number, s: string) => void
  ): Promise<ApplicationDocument[]> => {
    const parsedDocs: ApplicationDocument[] = [];
    const total = files.length;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      const doc = await parseUploadedFile(file, applicantId, (p, s) => {
        const overall = Math.round(((i + p / 100) / total) * 100);
        onProgress?.(overall, `[${i + 1}/${total}] ${s}`);
      });
      parsedDocs.push(doc);
    }

    setApplicants(prev => prev.map(app => {
      if (app.id === applicantId) {
        return {
          ...app,
          documents: [...app.documents, ...parsedDocs],
          status: app.status === 'DRAFT' ? 'DOCUMENTS_INGESTED' : app.status,
        };
      }
      return app;
    }));

    return parsedDocs;
  };

  const createNewApplication = async (data: Partial<Applicant>, files: File[]): Promise<string> => {
    const newId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newAppNumber = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApplicant: Applicant = {
      id: newId,
      applicationNumber: newAppNumber,
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'Applicant',
      email: data.email || `${data.firstName?.toLowerCase() || 'applicant'}@email.com`,
      countryOfOrigin: data.countryOfOrigin || 'International',
      nationality: data.nationality || data.countryOfOrigin || 'International',
      passportNumber: data.passportNumber || '',
      targetProgram: data.targetProgram || 'MS in Computer Science',
      targetSpecialization: data.targetSpecialization || 'General Track',
      targetTerm: data.targetTerm || 'Fall 2026',
      targetDegreeLevel: data.targetDegreeLevel || 'MASTER',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'DOCUMENTS_INGESTED',
      undergraduateInstitution: data.undergraduateInstitution || 'Undergraduate University',
      undergraduateMajor: data.undergraduateMajor || 'Computer Science',
      rawGPA: data.rawGPA || '3.70 / 4.00',
      normalizedGPA: data.normalizedGPA || 3.70,
      englishProficiencyType: data.englishProficiencyType || 'IELTS',
      englishOverallScore: data.englishOverallScore || 7.5,
      englishSubScores: data.englishSubScores || { reading: 8, listening: 8, speaking: 7.5, writing: 7 },
      greScore: data.greScore,
      documents: [],
      tags: ['New Application', 'Pending Analysis'],
    };

    // Ingest files if provided
    if (files && files.length > 0) {
      const parsedDocs: ApplicationDocument[] = [];
      for (const file of files) {
        const doc = await parseUploadedFile(file, newId);
        parsedDocs.push(doc);
      }
      newApplicant.documents = parsedDocs;
    }

    setApplicants(prev => [newApplicant, ...prev]);
    setActiveApplicantId(newId);
    setActiveTab('APPLICANT_DETAIL');

    // Automatically trigger AI analysis
    setTimeout(() => {
      runAnalysisForApplicant(newId);
    }, 300);

    return newId;
  };

  const sendChatQuery = async (applicantId: string, question: string) => {
    const target = applicants.find(a => a.id === applicantId);
    if (!target) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      applicantId,
      role: 'USER',
      content: question,
      timestamp: new Date().toISOString(),
    };

    const currentHistory = chatMessages[applicantId] || [];
    const updatedHistory = [...currentHistory, userMsg];

    // Optimistic user message update
    setChatMessages(prev => ({
      ...prev,
      [applicantId]: updatedHistory,
    }));

    try {
      const { answer, citations, suggestedFollowUps } = await askApplicationQuestion(target, question, updatedHistory);
      const assistantMsg: ChatMessage = {
        id: `msg_asst_${Date.now()}`,
        applicantId,
        role: 'ASSISTANT',
        content: answer,
        timestamp: new Date().toISOString(),
        citations,
        suggestedFollowUps,
      };

      setChatMessages(prev => ({
        ...prev,
        [applicantId]: [...(prev[applicantId] || []), assistantMsg],
      }));
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        applicantId,
        role: 'ASSISTANT',
        content: `Error processing question: ${err.message || 'Network error'}`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => ({
        ...prev,
        [applicantId]: [...(prev[applicantId] || []), errorMsg],
      }));
    }
  };

  const resetAllData = () => {
    if (window.confirm('Reset all applications and restore default sample datasets?')) {
      localStorage.removeItem(APPLICANTS_STORAGE_KEY);
      const fresh = getEnrichedInitialApplicants();
      setApplicants(fresh);
      setActiveApplicantId(fresh[0]?.id || null);
      setActiveTab('DASHBOARD');
      setChatMessages({});
    }
  };

  return (
    <AppContext.Provider
      value={{
        applicants,
        activeApplicantId,
        activeApplicant,
        activeTab,
        userRole,
        theme,
        selectedForComparison,
        llmConfig,
        isAnalyzing,
        analysisEvents,
        chatMessages,
        isApiKeyModalOpen,
        isNewApplicationModalOpen,
        setActiveTab,
        selectApplicant,
        setUserRole,
        toggleTheme,
        toggleCompareSelection,
        clearComparison,
        toggleFavorite,
        openApiKeyModal,
        closeApiKeyModal,
        openNewApplicationModal,
        closeNewApplicationModal,
        updateLLMConfig,
        runAnalysisForApplicant,
        updateApplicantDecision,
        uploadDocumentsForApplicant,
        createNewApplication,
        sendChatQuery,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
