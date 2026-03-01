
import React, { useState, useCallback } from 'react';
import type { AnalysisResult } from '../types';
import { KeywordIcon } from './icons/KeywordIcon';
import { ActionVerbIcon } from './icons/ActionVerbIcon';
import { QuantifyIcon } from './icons/QuantifyIcon';
import { FormatIcon } from './icons/FormatIcon';
import { SuggestionIcon } from './icons/SuggestionIcon';
import { CopyIcon } from './icons/CopyIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';


interface ScoreCircleProps {
  score: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = 'stroke-green-500';
  if (score < 50) strokeColor = 'stroke-red-500';
  else if (score < 75) strokeColor = 'stroke-yellow-500';

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 140 140">
        <circle
          className="stroke-slate-700"
          strokeWidth="10"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
        <circle
          className={`${strokeColor} transition-all duration-1000 ease-in-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="70"
          cy="70"
        />
      </svg>
      <span className="absolute text-4xl font-bold text-white">{score}</span>
      <span className="absolute mt-14 text-sm text-slate-400">Score</span>
    </div>
  );
};

interface KeywordBadgeProps {
  keyword: string;
  type: 'match' | 'missing';
}

const KeywordBadge: React.FC<KeywordBadgeProps> = ({ keyword, type }) => {
  const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center";
  const typeClasses = type === 'match'
    ? "bg-green-900 text-green-300"
    : "bg-red-900 text-red-300";

  return (
    <span className={`${baseClasses} ${typeClasses}`}>
      {keyword}
    </span>
  );
};

const getSuggestionIcon = (category: string) => {
    const lowerCaseCategory = category.toLowerCase();
    if (lowerCaseCategory.includes('keyword')) return <KeywordIcon className="w-6 h-6 text-sky-400" />;
    if (lowerCaseCategory.includes('action verb')) return <ActionVerbIcon className="w-6 h-6 text-sky-400" />;
    if (lowerCaseCategory.includes('quantify') || lowerCaseCategory.includes('achievements')) return <QuantifyIcon className="w-6 h-6 text-sky-400" />;
    if (lowerCaseCategory.includes('format')) return <FormatIcon className="w-6 h-6 text-sky-400" />;
    return <SuggestionIcon className="w-6 h-6 text-sky-400" />;
}

interface AnalysisResultDisplayProps {
  result: AnalysisResult;
}

type Tab = 'analysis' | 'revised';

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result.revisedResumeText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [result.revisedResumeText]);

  const TabButton: React.FC<{tabId: Tab, children: React.ReactNode}> = ({ tabId, children }) => (
    <button
        onClick={() => setActiveTab(tabId)}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
            activeTab === tabId
            ? 'bg-sky-600 text-white'
            : 'text-slate-300 hover:bg-slate-700'
        }`}
    >
        {children}
    </button>
  );

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex-shrink-0 mb-4 border-b border-slate-700 pb-2">
          <div className="flex space-x-2">
              <TabButton tabId="analysis">Analysis Report</TabButton>
              <TabButton tabId="revised">Revised Resume</TabButton>
          </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        {activeTab === 'analysis' && (
             <div className="space-y-6">
             <div className="flex flex-col items-center p-4 bg-slate-900/50 rounded-xl">
               <ScoreCircle score={result.atsScore} />
               <p className="mt-4 text-center text-slate-300">{result.summary}</p>
             </div>
       
             <div className="space-y-4">
               <div>
                 <h3 className="text-lg font-semibold text-white mb-2">Matching Keywords</h3>
                 <div className="flex flex-wrap gap-2">
                   {result.matchingKeywords.length > 0 ? (
                     result.matchingKeywords.map((kw, i) => <KeywordBadge key={`match-${i}`} keyword={kw} type="match" />)
                   ) : (
                     <p className="text-slate-400 text-sm">No strong keyword matches found.</p>
                   )}
                 </div>
               </div>
               <div>
                 <h3 className="text-lg font-semibold text-white mb-2">Missing Keywords</h3>
                 <div className="flex flex-wrap gap-2">
                   {result.missingKeywords.length > 0 ? (
                     result.missingKeywords.map((kw, i) => <KeywordBadge key={`missing-${i}`} keyword={kw} type="missing" />)
                   ) : (
                       <p className="text-slate-400 text-sm">Great job, no critical keywords seem to be missing!</p>
                   )}
                 </div>
               </div>
             </div>
             
             <div>
               <h3 className="text-xl font-bold text-white mb-3">Actionable Suggestions</h3>
               <div className="space-y-3">
                 {result.suggestions.map((s, i) => (
                   <div key={i} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 flex items-start space-x-4">
                     <div className="flex-shrink-0 mt-1">
                       {getSuggestionIcon(s.category)}
                     </div>
                     <div>
                       <p className="font-semibold text-sky-400">{s.category}</p>
                       <p className="text-slate-300 mt-1">{s.suggestion}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
        )}
        
        {activeTab === 'revised' && (
            <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Projected Score Improvement</h3>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-slate-300">{result.atsScore}</p>
                            <p className="text-xs text-slate-400">Original</p>
                        </div>
                        <p className="text-3xl font-bold text-sky-400">→</p>
                         <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">{result.projectedScore}</p>
                            <p className="text-xs text-slate-400">Projected</p>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-1 px-3 rounded-md text-xs flex items-center transition-colors"
                    >
                        {isCopied ? (
                            <>
                                <ClipboardCheckIcon className="w-4 h-4 mr-1.5 text-green-400" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <CopyIcon className="w-4 h-4 mr-1.5" />
                                Copy
                            </>
                        )}
                    </button>
                    <pre className="w-full bg-slate-900/50 p-4 rounded-xl text-slate-300 whitespace-pre-wrap font-sans text-sm border border-slate-700">
                        {result.revisedResumeText}
                    </pre>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
