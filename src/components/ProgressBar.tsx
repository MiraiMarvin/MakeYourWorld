// ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="progress-bar">
      <div 
        className="progress-bar__fill" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;