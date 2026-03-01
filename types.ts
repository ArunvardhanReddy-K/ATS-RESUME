
export interface Suggestion {
  category: string;
  suggestion: string;
}

export interface AnalysisResult {
  atsScore: number;
  summary: string;
  matchingKeywords: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  revisedResumeText: string;
  projectedScore: number;
}
