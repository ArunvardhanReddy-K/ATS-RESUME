import React, { useRef } from 'react';
import { AnalyzeIcon } from './icons/AnalyzeIcon';
import { UploadIcon } from './icons/UploadIcon';
import { FileIcon } from './icons/FileIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ResumeInputFormProps {
  onFileChange: (file: File | null) => void;
  fileName: string;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ResumeInputForm: React.FC<ResumeInputFormProps> = ({
  onFileChange,
  fileName,
  jobDescription,
  setJobDescription,
  onSubmit,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onFileChange(file || null);
  };

  const handleFileRemove = () => {
    onFileChange(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-semibold mb-2 text-white">
          Your Resume (PDF)
        </label>
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isLoading}
        />
        {!fileName ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-slate-800 border-2 border-dashed border-slate-600 hover:border-sky-500 rounded-lg p-8 text-slate-400 hover:text-sky-400 transition duration-200"
          >
            <UploadIcon className="w-8 h-8 mr-3" />
            <span className="font-semibold">Click to upload PDF</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between bg-slate-800 border border-slate-600 rounded-lg p-4 text-slate-300">
            <div className="flex items-center overflow-hidden">
                <FileIcon className="w-5 h-5 mr-3 flex-shrink-0 text-sky-400" />
                <span className="truncate font-medium">{fileName}</span>
            </div>
            <button
              onClick={handleFileRemove}
              disabled={isLoading}
              className="ml-4 p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"
              aria-label="Remove file"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="job-description" className="block text-lg font-semibold mb-2 text-white">
          Job Description
        </label>
        <textarea
          id="job-description"
          rows={12}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          disabled={isLoading}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg p-4 text-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 resize-none placeholder-slate-500 disabled:opacity-50"
        />
      </div>
      <div>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-900/50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Please wait...
            </>
          ) : (
            <>
              <AnalyzeIcon className="w-5 h-5 mr-2" />
              Analyze My Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};
