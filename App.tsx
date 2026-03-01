import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ResumeInputForm } from './components/ResumeInputForm';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { Loader } from './components/Loader';
import { analyzeResume } from './services/geminiService';
import { parsePdfText } from './services/pdfParser';
import type { AnalysisResult } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) {
      setResumeText('');
      setResumeFileName('');
      setAnalysisResult(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Parsing PDF...');
    setError(null);
    setAnalysisResult(null);

    try {
      const text = await parsePdfText(file);
      setResumeText(text);
      setResumeFileName(file.name);
    } catch (err) {
      console.error('PDF parsing failed:', err);
      setError('Failed to parse PDF. Please ensure it is a valid, unencrypted file.');
      setResumeText('');
      setResumeFileName('');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError(resumeText.trim() ? 'Please provide the job description.' : 'Please upload your resume PDF.');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Analyzing...');
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume(resumeText, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('An error occurred during analysis. The API might be busy. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [resumeText, jobDescription]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:pr-4">
            <ResumeInputForm
              onFileChange={handleFileChange}
              fileName={resumeFileName}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:pl-4">
            <div className="bg-slate-800 rounded-2xl p-6 h-full border border-slate-700 shadow-lg">
              {isLoading ? (
                <Loader message={loadingMessage} />
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-red-400 font-semibold">{error}</p>
                </div>
              ) : analysisResult ? (
                <AnalysisResultDisplay result={analysisResult} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <SparklesIcon className="w-16 h-16 text-sky-400 mb-4" />
                  <h2 className="text-2xl font-bold text-white">Analysis Report</h2>
                  <p className="text-slate-400 mt-2 max-w-sm">
                    Upload your resume PDF and paste a job description to see your analysis.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Designed for educational and demonstration purposes.</p>
      </footer>
    </div>
  );
};

export default App;