
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          ATS Score Analyzer
        </h1>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">
          Optimize your resume for any job description with AI-powered insights.
        </p>
      </div>
    </header>
  );
};
