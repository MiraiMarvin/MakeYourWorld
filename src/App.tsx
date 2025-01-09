import React, { useCallback, useState } from 'react';
import Question from './components/Question';
import FinalPage from './components/FinalPage';
import './styles/app.scss';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const calculateTimeLeft = () => {
    const releaseDate = new Date('2025-01-21T00:00:00');
    const now = new Date();
    return Math.floor((releaseDate.getTime() - now.getTime()) / 1000);
  };
  
  const [timeLeft] = useState(calculateTimeLeft());

  const questions = [
    "Si votre esprit émettait un son, serait-il un murmure, un écho ou un cri ?",
    "Si votre cœur était une lumière, de quelle couleur brillerait-il ?", 
    "Si vous deviez visualiser votre âme, serait-elle fluide, anguleuse ou autre chose ?"
  ];

  const handleAnswer = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const MainContent = React.useMemo(() => {
    if (currentStep === 0) {
      return (
        <Question 
          number={1} 
          text={questions[0]} 
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      );
    }
    
    if (currentStep === 1) {
      return (
        <Question 
          number={2} 
          text={questions[1]} 
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      );
    }
    
    if (currentStep === 2) {
      return (
        <Question 
          number={3} 
          text={questions[2]} 
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      );
    }
    
    if (currentStep === 3) {
      return (
        <FinalPage 
          timeLeft={timeLeft}
          onBack={handleBack}
        />
      );
    }

    return null;
  }, [currentStep, timeLeft, handleAnswer, handleBack, questions]);

  return MainContent;
};

export default App;