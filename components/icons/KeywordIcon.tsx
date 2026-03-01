import React from 'react';

export const KeywordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 7h2a5 5 0 010 10h-2m-6 0H7A5 5 0 017 7h2m-2 5h6"
    />
  </svg>
);
