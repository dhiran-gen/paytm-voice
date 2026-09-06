// High-Performance In-Memory Vector Database & Semantic RAG Pipeline

import { Applicant, DocumentChunk, EvidenceCitation } from '../types';

// Stopwords for semantic tokenization
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
  'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each',
  'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d',
  'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i',
  'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll',
  'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d',
  'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize and normalize text into semantic n-grams and unigrams
 */
export function tokenizeText(text: string): string[] {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));

  const tokens = [...normalized];
  // Add bigrams for compound concepts (e.g. "machine learning", "deep learning", "grade point", "bank balance")
  for (let i = 0; i < normalized.length - 1; i++) {
    tokens.push(`${normalized[i]}_${normalized[i + 1]}`);
  }
  return tokens;
}

/**
 * Compute Term Frequency map for a token list
 */
function computeTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

/**
 * Calculate Cosine Similarity between two TF maps
 */
export function computeCosineSimilarity(tf1: Map<string, number>, tf2: Map<string, number>): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const [, count] of tf1.entries()) {
    norm1 += count * count;
  }
  for (const [, count] of tf2.entries()) {
    norm2 += count * count;
  }

  if (norm1 === 0 || norm2 === 0) return 0;

  for (const [term, count1] of tf1.entries()) {
    const count2 = tf2.get(term);
    if (count2) {
      // Apply semantic weighting to specialized terms
      let weight = 1.0;
      if (term.includes('gpa') || term.includes('research') || term.includes('loan') || term.includes('ielts') || term.includes('python')) {
        weight = 1.5;
      }
      dotProduct += count1 * count2 * weight;
    }
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
  applicantId: string;
  matchedSnippet: string;
}

/**
 * Perform semantic search across an applicant's documents
 */
export function searchApplicantChunks(
  applicant: Applicant,
  query: string,
  topK: number = 6,
  filterDocType?: string
): SearchResult[] {
  const queryTokens = tokenizeText(query);
  const queryTF = computeTF(queryTokens);

  const allChunks: { chunk: DocumentChunk; applicantId: string }[] = [];
  for (const doc of applicant.documents || []) {
    if (filterDocType && doc.type !== filterDocType) continue;
    for (const chunk of doc.chunks || []) {
      allChunks.push({ chunk, applicantId: applicant.id });
    }
  }

  const results: SearchResult[] = [];

  for (const item of allChunks) {
    const chunkTokens = tokenizeText(item.chunk.content);
    const chunkTF = computeTF(chunkTokens);
    let similarity = computeCosineSimilarity(queryTF, chunkTF);

    // Boost score if document title or type matches query keywords
    const docTypeLower = item.chunk.documentType.toLowerCase();
    const docNameLower = item.chunk.documentName.toLowerCase();
    for (const token of queryTokens) {
      if (docTypeLower.includes(token) || docNameLower.includes(token)) {
        similarity += 0.15;
      }
    }

    if (similarity > 0.05) {
      // Find the most relevant excerpt sentence in this chunk
      const sentences = item.chunk.content.split(/(?<=[.?!])\s+/);
      let bestSentence = sentences[0] || item.chunk.content.substring(0, 150);
      let maxOverlap = 0;

      for (const sentence of sentences) {
        const sTokens = tokenizeText(sentence);
        const overlap = queryTokens.filter(t => sTokens.includes(t)).length;
        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          bestSentence = sentence;
        }
      }

      results.push({
        chunk: item.chunk,
        score: Math.min(similarity, 0.99),
        applicantId: item.applicantId,
        matchedSnippet: bestSentence.trim(),
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

/**
 * Perform global semantic search across ALL applicants in the system
 */
export function searchAllApplicants(
  applicants: Applicant[],
  query: string,
  topK: number = 10
): { applicant: Applicant; score: number; bestSnippet: string; matchedDocs: string[] }[] {
  const queryTokens = tokenizeText(query);
  const queryTF = computeTF(queryTokens);

  const scoredApplicants: {
    applicant: Applicant;
    score: number;
    bestSnippet: string;
    matchedDocs: string[];
  }[] = [];

  for (const applicant of applicants) {
    // Score applicant profile metadata first
    const profileText = `${applicant.firstName} ${applicant.lastName} ${applicant.targetProgram} ${applicant.targetSpecialization} ${applicant.countryOfOrigin} ${applicant.undergraduateInstitution} ${applicant.undergraduateMajor} GPA ${applicant.rawGPA} ${applicant.englishProficiencyType} ${applicant.englishOverallScore} ${(applicant.tags || []).join(' ')}`;
    const profileTokens = tokenizeText(profileText);
    const profileTF = computeTF(profileTokens);
    let profileScore = computeCosineSimilarity(queryTF, profileTF) * 1.3;

    // Search document chunks
    const chunkResults = searchApplicantChunks(applicant, query, 3);
    const topChunk = chunkResults[0];

    const totalScore = Math.max(profileScore, topChunk ? topChunk.score : 0);
    const matchedDocs = Array.from(new Set(chunkResults.map(r => r.chunk.documentName)));

    if (totalScore > 0.08) {
      scoredApplicants.push({
        applicant,
        score: totalScore,
        bestSnippet: topChunk ? topChunk.matchedSnippet : `${applicant.targetProgram} applicant from ${applicant.undergraduateInstitution}`,
        matchedDocs,
      });
    }
  }

  scoredApplicants.sort((a, b) => b.score - a.score);
  return scoredApplicants.slice(0, topK);
}

/**
 * Convert SearchResults into structured EvidenceCitations
 */
export function convertToCitations(results: SearchResult[]): EvidenceCitation[] {
  return results.map((r, i) => ({
    id: `cite_${Date.now()}_${i}`,
    documentId: r.chunk.documentId,
    documentName: r.chunk.documentName,
    documentType: r.chunk.documentType,
    snippet: r.matchedSnippet,
    pageNumber: r.chunk.pageNumber,
    contextNote: `Cosine similarity match: ${Math.round(r.score * 100)}%`,
  }));
}
