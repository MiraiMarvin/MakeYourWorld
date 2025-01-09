import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import '../styles/components/question.scss';
import { gsap } from 'gsap';

type QuestionChoice = 'or' | 'argent';
type QuestionType = 1 | 2 | 3;

interface QuestionProps {
  number: QuestionType;
  text: string;
  onAnswer: () => void;
}

interface UserAnswers {
  question1: number;
  question2: QuestionChoice | null;
  question3: number;
  timestamp?: number;
}

const Question: React.FC<QuestionProps> = ({ number, text, onAnswer }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [debugMode, setDebugMode] = useState(false);

  const getSavedAnswer = useCallback(() => {
    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
      const parsed: UserAnswers = JSON.parse(savedAnswers);
      const now = Date.now();
      
      if (parsed.timestamp && (now - parsed.timestamp) > 30 * 60 * 1000) {
        localStorage.removeItem('userAnswers');
        return null;
      }
      
      return parsed;
    }
    return null;
  }, []);

  const [value, setValue] = useState(() => {
    const savedAnswers = getSavedAnswer();
    if (savedAnswers) {
      if (number === 1) return savedAnswers.question1 ?? 0;
      if (number === 3) return savedAnswers.question3 ?? 0;
    }
    return 0;
  });

  const [selectedChoice, setSelectedChoice] = useState<QuestionChoice | null>(() => {
    const savedAnswers = getSavedAnswer();
    return number === 2 ? (savedAnswers?.question2 ?? null) : null;
  });

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    const animationEnter = () => gsap.to(imgElement, { rotation: 360, duration: 1 });
    const animationLeave = () => gsap.to(imgElement, { rotation: 0, duration: 1 });

    gsap.set(imgElement, { rotation: 0 });
    imgElement.addEventListener('mouseenter', animationEnter);
    imgElement.addEventListener('mouseleave', animationLeave);

    return () => {
      imgElement.removeEventListener('mouseenter', animationEnter);
      imgElement.removeEventListener('mouseleave', animationLeave);
    };
  }, []);

  const saveAnswer = useCallback(() => {
    const savedAnswers = localStorage.getItem('userAnswers');
    const currentAnswers: UserAnswers = savedAnswers 
      ? JSON.parse(savedAnswers)
      : { question1: 0, question2: null, question3: 0 };
  
    switch(number) {
      case 1:
        currentAnswers.question1 = value;
        break;
      case 2:
        currentAnswers.question2 = selectedChoice;
        break;
      case 3:
        currentAnswers.question3 = value;
        break;
    }
  
    currentAnswers.timestamp = Date.now();
  
    localStorage.setItem('userAnswers', JSON.stringify(currentAnswers));
    onAnswer();
  }, [number, value, selectedChoice, onAnswer]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  }, []);

  const handleChoiceSelect = useCallback((choice: QuestionChoice) => {
    setSelectedChoice(prevChoice => prevChoice === choice ? null : choice);
  }, []);

  const labels = useMemo(() => {
    switch(number) {
      case 1: return { left: "WHISPER", right: "SCREAM" };
      case 3: return { left: "FLUIDE", right: "ANGULEUSE" };
      default: return { left: "", right: "" };
    }
  }, [number]);

  const renderQuestionInput = useMemo(() => {
    if (number === 2) {
      return (
        <div className="choice-buttons">
          {(['or', 'argent'] as QuestionChoice[]).map((choice) => (
            <button 
              key={choice}
              className={`choice-button ${selectedChoice === choice ? 'selected' : ''}`}
              onClick={() => handleChoiceSelect(choice)}
            >
              <div className="radio-circle"></div>
              <span>{choice.toUpperCase()}</span>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="scale">
        <div className="scale-line">
          <div className="dot left"></div>
          <div className="dot middle"></div>
          <div className="dot right"></div>
        </div>
        <input type="range" min="0" max="10" step="0.1" value={value} onChange={handleSliderChange}className="slider"
        />
        <div className="scale-labels">
          <span className="left-label">{labels.left}</span>
          <span className="right-label">{labels.right}</span>
        </div>
      </div>
    );
  }, [number, value, selectedChoice, handleSliderChange, handleChoiceSelect, labels]);

  return (
    <section id="questionSection">
      <section id='header'>
        <div className='go_back'>
          <a href='https://github.com/MiraiMarvin/MakeYourWorld'>
            <img ref={imgRef} src='public/assets/image/star.svg' alt='star' />
          </a>
          <p>GO BACK</p>
        </div>
      </section>

      <div 
        onKeyPress={(e) => {
          if (e.key === 'd') setDebugMode(!debugMode);
        }} 
        tabIndex={0}
      >
        <div className="container">
          <span className="question-number">.{number}</span>
          <h2 className="question-text">{text}</h2>
        </div>

        {renderQuestionInput}

        <button 
          className="next-button"
          onClick={saveAnswer}
          disabled={number === 2 && !selectedChoice}
        >
          {number === 3 ? 'DECOUVRIR LE REFLET' : 'SUIVANT'}
        </button>

        {debugMode && (
          <div style={{ position: 'fixed', top: '10px',right: '10px',background: 'rgba(0,0,0,0.8)',padding: '10px',borderRadius: '5px',color: 'white',fontSize: '12px'
          }}>
            <pre>
              {JSON.stringify({currentQuestion: number, value, selectedChoice,savedAnswers: JSON.parse(localStorage.getItem('userAnswers') || '{}')}, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className='title-align'>
        <h1>P.LATINIU.M</h1>
        <h3>LIKE A CRY.</h3>
      </div>
    </section>
  );
};

export default Question;