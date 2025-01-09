import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Question from './components/Question';
import FinalPage from './components/FinalPage';
import TestPage from './TestPage';
import './styles/app.scss';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft] = useState(200);

  const questions = [
    "Si votre esprit émettait un son, serait-il un murmure, un écho ou un cri ?",
    "Si votre cœur était une lumière, de quelle couleur brillerait-il ?", 
    "Si vous deviez visualiser votre âme, serait-elle fluide, anguleuse ou autre chose ?"
  ];

  const handleAnswer = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const MainContent = React.useMemo(() => {
    if (currentStep === 0) {
      return (
        <Question  number={1} text={questions[0]} onAnswer={handleAnswer}/>
      );
    }
    
    if (currentStep === 1) {
      return (
        <Question number={2} text={questions[1]} onAnswer={handleAnswer} />
      );
    }
    
    if (currentStep === 2) {
      return (
        <Question number={3} text={questions[2]} onAnswer={handleAnswer}/>
      );
    }
    
    if (currentStep === 3) {
      return <FinalPage timeLeft={timeLeft} />;
    }

    return null;
  }, [currentStep, timeLeft, handleAnswer, questions]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={MainContent} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
};

export default App;