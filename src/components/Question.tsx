import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/question.scss';
import { gsap } from 'gsap';

interface QuestionProps {
  number: number;
  text: string;
  onAnswer: () => void;
}

interface UserAnswers {
  question1: number;
  question2: 'or' | 'argent' | null;
  question3: number;
}

const Question: React.FC<QuestionProps> = ({ number, text, onAnswer }) => {
  const isLastQuestion = number === 3;
  const [value, setValue] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<'or' | 'argent' | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement) {
      gsap.set(imgElement, { rotation: 0 });
      imgElement.addEventListener('mouseenter', () => {
        gsap.to(imgElement, { rotation: 360, duration: 1 });
      });
      imgElement.addEventListener('mouseleave', () => {
        gsap.to(imgElement, { rotation: 0, duration: 1 });
      });
    }
    return () => {
      if (imgElement) {
        imgElement.removeEventListener('mouseenter', () => {});
        imgElement.removeEventListener('mouseleave', () => {});
      }
    };
  }, []);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
      const answers: UserAnswers = JSON.parse(savedAnswers);
      switch(number) {
        case 1:
          setValue(answers.question1 || 0);
          break;
        case 2:
          setSelectedChoice(answers.question2);
          break;
        case 3:
          setValue(answers.question3 || 0);
          break;
      }
    }
  }, [number]);

  const saveAnswer = () => {
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

    localStorage.setItem('userAnswers', JSON.stringify(currentAnswers));
    onAnswer();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  };

  const handleChoiceSelect = (choice: 'or' | 'argent') => {
    setSelectedChoice(choice);
  };

  const getLabels = (questionNumber: number) => {
    switch(questionNumber) {
      case 1:
        return {
          left: "WHISPER",
          right: "SCREAM"
        };
      case 3:
        return {
          left: "FLUIDE",
          right: "ANGULEUSE"
        };
      default:
        return {
          left: "",
          right: ""
        };
    }
  };

  const renderQuestionInput = () => {
    if (number === 2) {
      return (
        <div className="choice-buttons">
          <button 
            className={`choice-button ${selectedChoice === 'or' ? 'selected' : ''}`}
            onClick={() => handleChoiceSelect('or')}
          >
            <div className="radio-circle"></div>
            <span>OR</span>
          </button>
          <button 
            className={`choice-button ${selectedChoice === 'argent' ? 'selected' : ''}`}
            onClick={() => handleChoiceSelect('argent')}
          >
            <div className="radio-circle"></div>
            <span>ARGENT</span>
          </button>
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
        <input 
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={value}
          onChange={handleSliderChange}
          className="slider"
        />
        <div className="scale-labels">
          <span className="left-label">{getLabels(number).left}</span>
          <span className="right-label">{getLabels(number).right}</span>
        </div>
      </div>
    );
  };

  const renderDebugPanel = () => {
    if (!debugMode) return null;

    const savedAnswers = localStorage.getItem('userAnswers');
    const answers = savedAnswers ? JSON.parse(savedAnswers) : null;

    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        padding: '10px',
        borderRadius: '5px',
        color: 'white',
        fontSize: '12px'
      }}>
        <pre>{JSON.stringify(answers, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="question-container">
      <section id='header'>
        <div className='go_back'>
          <a href='https://github.com/MiraiMarvin/MakeYourWorld'>
            <img ref={imgRef} src='public/assets/image/star.svg' alt='star' />
          </a>
          <p>GO BACK</p>
        </div>
      </section>

      <div onKeyPress={(e) => {
        if (e.key === 'd') setDebugMode(!debugMode);
      }} tabIndex={0}>
        <div className="container">
          <span className="question-number">.{number}</span>
          <h2 className="question-text">{text}</h2>
        </div>

        {renderQuestionInput()}

        <button 
          className="next-button"
          onClick={saveAnswer}
          disabled={number === 2 && !selectedChoice}
        >
          {isLastQuestion ? 'DECOUVRIR LE REFLET' : 'SUIVANT'}
        </button>

        {renderDebugPanel()}
      </div>

      <div className='title-align'>
        <h1>P.LATINIU.M</h1>
        <h3>LIKE A CRY.</h3>
      </div>
    </div>
  );
};

export default Question;