import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-500"></div>
      <h2 className="text-2xl font-bold text-white mt-6">{message || 'Loading...'}</h2>
      <p className="text-slate-400 mt-2">
        This might take a moment.
      </p>
    </div>
  );
};