// New Applicant Creation & Multi-Document Ingestion Modal

import {
  Brain,
  FileText,
  Loader2,
  UploadCloud,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Applicant } from '../../types';

export const NewApplicationModal: React.FC = () => {
  const {
    isNewApplicationModalOpen,
    closeNewApplicationModal,
    createNewApplication,
  } = useApp();

  const [formData, setFormData] = useState<Partial<Applicant>>({
    firstName: '',
    lastName: '',
    email: '',
    countryOfOrigin: 'India',
    nationality: 'Indian',
    targetProgram: 'MS in Computer Science',
    targetSpecialization: 'Artificial Intelligence & Data Science',
    targetTerm: 'Fall 2026',
    undergraduateInstitution: '',
    undergraduateMajor: 'Computer Science and Engineering',
    rawGPA: '3.80 / 4.00',
    normalizedGPA: 3.80,
    englishProficiencyType: 'IELTS',
    englishOverallScore: 8.0,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, _setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isNewApplicationModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.targetProgram) {
      alert('Please fill out all required applicant fields.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Ingesting documents & extracting text...');

    try {
      await createNewApplication(formData, files);
      setIsProcessing(false);
      closeNewApplicationModal();
    } catch (err: any) {
      alert(`Failed to create application: ${err.message || 'Error'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">New International Application</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ingest applicant records with OCR and automated multi-agent reasoning</p>
            </div>
          </div>
          <button
            onClick={closeNewApplicationModal}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Personal & Degree Information */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              1. Applicant & Program Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rostova"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="elena.rostova@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Country of Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Germany, Japan, India..."
                  value={formData.countryOfOrigin}
                  onChange={e => setFormData({ ...formData, countryOfOrigin: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Target Master's Program</label>
                <select
                  value={formData.targetProgram}
                  onChange={e => setFormData({ ...formData, targetProgram: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="MS in Computer Science">MS in Computer Science</option>
                  <option value="MS in Robotics & Autonomous Systems">MS in Robotics & Autonomous Systems</option>
                  <option value="MS in Cybersecurity & Privacy">MS in Cybersecurity & Privacy</option>
                  <option value="MS in Software Engineering">MS in Software Engineering</option>
                  <option value="MS in Data Science & Analytics">MS in Data Science & Analytics</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Undergraduate Institution</label>
                <input
                  type="text"
                  placeholder="e.g. Technical University of Munich"
                  value={formData.undergraduateInstitution}
                  onChange={e => setFormData({ ...formData, undergraduateInstitution: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Undergraduate GPA (Raw)</label>
                <input
                  type="text"
                  placeholder="e.g. 3.85 / 4.0 or 9.1/10"
                  value={formData.rawGPA}
                  onChange={e => {
                    const val = e.target.value;
                    const num = parseFloat(val.replace(/[^0-9.]/g, '')) || 3.5;
                    const norm = val.includes('/10') || num > 4.5 ? Number(((num / 10) * 4.0).toFixed(2)) : num;
                    setFormData({ ...formData, rawGPA: val, normalizedGPA: norm });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">English Test & Score</label>
                <div className="flex gap-2">
                  <select
                    value={formData.englishProficiencyType}
                    onChange={e => setFormData({ ...formData, englishProficiencyType: e.target.value as any })}
                    className="w-1/3 px-2 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="IELTS">IELTS</option>
                    <option value="TOEFL">TOEFL</option>
                    <option value="DUOLINGO">Duolingo</option>
                  </select>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="Score"
                    value={formData.englishOverallScore}
                    onChange={e => setFormData({ ...formData, englishOverallScore: parseFloat(e.target.value) || 0 })}
                    className="w-2/3 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              2. Upload Application Documents (PDF, DOCX, Scans, Images)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Upload transcript, SOP, resume, letters of recommendation, bank solvency certificate, etc. Our OCR and document classifier will categorize and index them automatically.
            </p>

            {/* Dropzone */}
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-colors">
              <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Click to browse or drag & drop application documents
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, DOCX, PNG, JPG, Scanned TIFF</p>
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Attached Files ({files.length}):
                </p>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="truncate font-medium text-slate-800 dark:text-slate-200">{file.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({Math.round(file.size / 1024)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-200">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                  {statusMessage}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeNewApplicationModal}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/30 transition-all hover:scale-102 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Ingesting & Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Create & Run Multi-Agent Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
