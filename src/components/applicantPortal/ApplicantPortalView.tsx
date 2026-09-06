// Student Self-Service Applicant Portal View

import {
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  GraduationCap,
  Loader2,
  MessageSquare,
  ShieldCheck,
  UploadCloud
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ApplicantPortalView: React.FC = () => {
  const {
    activeApplicant,
    uploadDocumentsForApplicant,
  } = useApp();

  const applicant = activeApplicant;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [studentMessage, setStudentMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'STUDENT' | 'OFFICE'; text: string; time: string }>>([
    {
      sender: 'OFFICE',
      text: 'Welcome to the International Admissions Portal. Your uploaded documents have been ingested by our intelligence platform.',
      time: 'Feb 18, 2026, 10:00 AM'
    }
  ]);

  if (!applicant) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p>No active applicant found in portal session.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0 || isUploading) return;
    setIsUploading(true);
    setUploadStatus('Running OCR and vector indexing on new documents...');

    try {
      await uploadDocumentsForApplicant(applicant.id, selectedFiles, (prog, msg) => {
        setUploadStatus(`${msg} (${prog}%)`);
      });
      setSelectedFiles([]);
      setIsUploading(false);
      alert('Documents uploaded and verified successfully!');
    } catch (e: any) {
      alert(`Upload failed: ${e.message}`);
      setIsUploading(false);
    }
  };

  const handleSendMessage = () => {
    if (!studentMessage.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        sender: 'STUDENT',
        text: studentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setStudentMessage('');

    // Automated acknowledgment from admissions office bot
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'OFFICE',
          text: `Thank you for your message. An international admissions officer has been notified regarding your ${applicant.targetProgram} application.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1000);
  };

  // Checklist of typical required documents
  const requiredDocs = [
    { type: 'TRANSCRIPT', title: 'Official Academic Transcript', desc: 'Registrar signed transcript with grading scale' },
    { type: 'SOP', title: 'Statement of Purpose (SOP)', desc: 'Articulating academic trajectory and faculty fit' },
    { type: 'RESUME', title: 'Curriculum Vitae / Resume', desc: 'Detailed technical projects, work experience, and publications' },
    { type: 'LOR', title: 'Letters of Recommendation (LORs)', desc: 'Minimum 2 academic or professional references' },
    { type: 'FINANCIAL', title: 'Financial Solvency Certificate / Loan Letter', desc: 'Proof of liquid funding for Year-1 Cost of Attendance' },
    { type: 'IELTS_TOEFL', title: 'English Proficiency Test Score (IELTS/TOEFL)', desc: 'Official score report card' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>International Student Application Portal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {applicant.firstName} {applicant.lastName}
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Application ID: <span className="font-mono font-bold text-white">{applicant.applicationNumber}</span> &bull; {applicant.targetProgram} ({applicant.targetTerm})
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-left sm:text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Review Status</span>
            <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5 sm:justify-end mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
              {applicant.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Responsible AI Student Disclosure */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Transparent Admissions Process:</p>
          <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-0.5 leading-relaxed">
            Our admissions committee utilizes multimodal document intelligence to verify transcripts, test scores, and financial records. Final admission decisions are made strictly by authorized university faculty and admissions deans.
          </p>
        </div>
      </div>

      {/* Document Checklist Grid */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Application Document Verification Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live status of ingested and verified application records
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {applicant.documents.length} Files Ingested
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {requiredDocs.map(req => {
            const uploaded = applicant.documents.find(d => d.type === req.type);
            return (
              <div
                key={req.type}
                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  uploaded
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                    : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                }`}
              >
                <div className="space-y-1 truncate pr-2">
                  <div className="flex items-center gap-1.5">
                    {uploaded ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {req.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{req.desc}</p>
                  {uploaded && (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono font-medium truncate flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{uploaded.name}</span>
                    </p>
                  )}
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                    uploaded
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                      : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  {uploaded ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplementary Document Uploader */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Upload Supplementary Documents
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submit updated financial affidavits, loan sanction updates, new GRE/IELTS score cards, or certificates
          </p>
        </div>

        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer transition-colors">
          <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Click to upload supplementary PDF, DOCX, or scanned certificates
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Selected Files ({selectedFiles.length}):
            </p>
            <div className="space-y-1">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs"
                >
                  <span className="font-medium truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({Math.round(file.size / 1024)} KB)</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleUploadSubmit}
              disabled={isUploading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{uploadStatus}</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Submit Documents for Automated Verification</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Message Exchange with Admissions Office */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>Admissions Office Communication Channel</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct message thread with your assigned international admissions counselor
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl text-xs max-w-lg ${
                m.sender === 'STUDENT'
                  ? 'ml-auto bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
              }`}
            >
              <p>{m.text}</p>
              <span className={`text-[9px] block mt-1 ${m.sender === 'STUDENT' ? 'text-blue-200' : 'text-slate-400'}`}>
                {m.time}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to the Admissions Office..."
            value={studentMessage}
            onChange={e => setStudentMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
