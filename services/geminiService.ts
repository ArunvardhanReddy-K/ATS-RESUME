
import { GoogleGenAI, Type } from '@google/genai';
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.INTEGER,
      description: "An ATS compatibility score from 0 to 100 for the original resume against the job description.",
    },
    summary: {
      type: Type.STRING,
      description: "A concise, professional summary (2-3 sentences) of the original resume's strengths and weaknesses.",
    },
    matchingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of important keywords from the job description that were found in the original resume.",
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of crucial keywords from the job description that are missing from the original resume.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: "The area of improvement, e.g., 'Keyword Optimization', 'Action Verbs', 'Quantify Achievements', 'Formatting'.",
          },
          suggestion: {
            type: Type.STRING,
            description: "A specific, actionable piece of advice for improving the resume.",
          },
        },
        required: ["category", "suggestion"],
      },
    },
    revisedResumeText: {
        type: Type.STRING,
        description: "The full text of a revised and improved resume, optimized for the job description based on the analysis and suggestions."
    },
    projectedScore: {
        type: Type.INTEGER,
        description: "The projected ATS score (0-100) for the newly generated, revised resume."
    }
  },
  required: ["atsScore", "summary", "matchingKeywords", "missingKeywords", "suggestions", "revisedResumeText", "projectedScore"],
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) and professional career coach.
    Your task is to analyze the following resume against the provided job description and then generate an improved version of the resume.

    **Analysis Steps:**
    1.  **Analyze the original resume:**
        - Calculate an ATS score (0-100) based on keyword matching, experience relevance, and skills alignment.
        - Identify key skills from the job description that are present (matchingKeywords) and absent (missingKeywords).
        - Provide a brief summary of its strengths and weaknesses.
        - Offer specific, actionable suggestions for improvement across different categories.
    2.  **Rewrite the resume:**
        - Based on your analysis, completely rewrite the resume text to be highly optimized for the job description.
        - Seamlessly integrate missing keywords and skills.
        - Rephrase bullet points using strong action verbs and quantifiable achievements.
        - Ensure the language is professional and compelling.
        - Maintain a clear and standard resume format in the text.
    3.  **Project the new score:**
        - Estimate a new "projectedScore" for the revised resume you just created.

    **Job Description:**
    ---
    ${jobDescription}
    ---

    **Original Resume Text:**
    ---
    ${resumeText}
    ---

    Provide your complete response in the required JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};
