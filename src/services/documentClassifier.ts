// Intelligent Document Type Classifier

import { DocumentType } from '../types';

export function classifyDocument(fileName: string, extractedText: string): DocumentType {
  const lowerName = fileName.toLowerCase();
  const lowerText = extractedText.toLowerCase();

  // Check filename first for immediate clues
  if (lowerName.includes('transcript') || lowerName.includes('mark') || lowerName.includes('grade') || lowerName.includes('academic_record')) {
    return 'TRANSCRIPT';
  }
  if (lowerName.includes('sop') || lowerName.includes('statement_of_purpose') || lowerName.includes('personal_statement') || lowerName.includes('motivation')) {
    return 'SOP';
  }
  if (lowerName.includes('resume') || lowerName.includes('cv') || lowerName.includes('curriculum_vitae')) {
    return 'RESUME';
  }
  if (lowerName.includes('lor') || lowerName.includes('recommendation') || lowerName.includes('reference') || lowerName.includes('letter_of_rec')) {
    return 'LOR';
  }
  if (lowerName.includes('ielts') || lowerName.includes('toefl') || lowerName.includes('duolingo') || lowerName.includes('pte') || lowerName.includes('english')) {
    return 'IELTS_TOEFL';
  }
  if (lowerName.includes('bank') || lowerName.includes('financial') || lowerName.includes('affidavit') || lowerName.includes('solvency') || lowerName.includes('loan') || lowerName.includes('fund') || lowerName.includes('statement')) {
    return 'FINANCIAL';
  }
  if (lowerName.includes('certificate') || lowerName.includes('diploma') || lowerName.includes('coursera') || lowerName.includes('udemy') || lowerName.includes('deeplearning')) {
    return 'CERTIFICATE';
  }
  if (lowerName.includes('passport') || lowerName.includes('visa') || lowerName.includes('identity') || lowerName.includes('id_card')) {
    return 'PASSPORT';
  }
  if (lowerName.includes('experience') || lowerName.includes('relieving') || lowerName.includes('internship') || lowerName.includes('offer_letter') || lowerName.includes('payslip')) {
    return 'WORK_EXP';
  }

  // Deep Content Analysis
  if (lowerText.includes('cumulative grade point') || lowerText.includes('cgpa') || lowerText.includes('semester') || lowerText.includes('credits') || lowerText.includes('course code') || lowerText.includes('marks obtained') || lowerText.includes('grading scale')) {
    return 'TRANSCRIPT';
  }
  if (lowerText.includes('statement of purpose') || lowerText.includes('personal statement') || (lowerText.includes('aspire to pursue') && lowerText.includes('passion for') && lowerText.includes('career goals'))) {
    return 'SOP';
  }
  if (lowerText.includes('curriculum vitae') || (lowerText.includes('work experience') && lowerText.includes('education') && lowerText.includes('skills') && lowerText.includes('projects'))) {
    return 'RESUME';
  }
  if (lowerText.includes('letter of recommendation') || lowerText.includes('to whom it may concern') || lowerText.includes('pleasure in recommending') || lowerText.includes('academic advisor') || lowerText.includes('recommending him') || lowerText.includes('recommending her')) {
    return 'LOR';
  }
  if (lowerText.includes('ielts') || lowerText.includes('toefl') || lowerText.includes('band score') || lowerText.includes('overall band') || lowerText.includes('listening reading writing speaking')) {
    return 'IELTS_TOEFL';
  }
  if (lowerText.includes('account balance') || lowerText.includes('bank statement') || lowerText.includes('affidavit of support') || lowerText.includes('solvency certificate') || lowerText.includes('loan sanction') || lowerText.includes('available balance')) {
    return 'FINANCIAL';
  }
  if (lowerText.includes('certificate of completion') || lowerText.includes('successfully completed') || lowerText.includes('specialization') || lowerText.includes('credential id')) {
    return 'CERTIFICATE';
  }
  if (lowerText.includes('passport') || lowerText.includes('republic of') || lowerText.includes('nationality') || lowerText.includes('date of birth') && lowerText.includes('expiry date')) {
    return 'PASSPORT';
  }
  if (lowerText.includes('relieving letter') || lowerText.includes('experience certificate') || lowerText.includes('designation') && lowerText.includes('employment')) {
    return 'WORK_EXP';
  }

  return 'OTHER';
}
