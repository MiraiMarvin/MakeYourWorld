import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Question from './components/Question';
import TestPage from './TestPage'; 
import { gsap } from 'gsap';
import './styles/app.scss';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(200);
  const imgRef = useRef<HTMLImageElement>(null);

  const questions = [
    "Si votre esprit émettait un son, serait-il un murmure, un écho ou un cri ?",
    "Si votre cœur était une lumière, de quelle couleur brillerait-il ?", 
    "Si vous deviez visualiser votre âme, serait-elle fluide, anguleuse ou autre chose ?"
  ];

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

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

  const handleAnswer = () => {
    setCurrentStep(prev => prev + 1);
  };

  const MainContent = () => {
    if (currentStep < 3) {
      return (
        <Question 
          number={currentStep + 1} 
          text={questions[currentStep]}
          onAnswer={handleAnswer}
        />
      );
    }

    return (
      <>
        <section id='header'>
          <div className='go_back'>
            <a href='https://github.com/MiraiMarvin/MakeYourWorld'>
              <img ref={imgRef} src='public/assets/image/star.svg' alt='star' />
            </a>
            <p>GO BACK</p>
          </div>
        </section>

        <section id='title'>
          <h2>"VOTRE COEUR PARLE POUR VOUS"</h2>
        </section>

        <section id='canvas'>
          <img src='public/assets/image/cover.png' alt='cover' />
        </section>

        <section id='content'>
          <div>
            <div className='title-align'>
              <h1>P.LATINIU.M</h1>
              <h3>LIKE A CRY.</h3>
            </div>
            <p className='red bold'>LAYLOW PRESENT:</p>
            <div className='list-align'>
              <div className='left'>
                <ul>
                  <li>"Prismes Brisés(ft chuck noris)"</li>
                  <li>"Lumière Noire"</li>
                  <li>"Venin dans la Veine"</li>
                  <li>"Echos d'Abîmes"</li>
                  <li>"Os et Métal(ft zemmour)"</li>
                  <li>"Le Silence des Ombres"</li>
                  <li>"Sang Numérique (ft Mr anderson)"</li>
                </ul>
              </div>
              <div className='right'>
                <ul>
                  <li>"Nuit de Chrome (ft damso)"</li>
                  <li>"Âmes Fracturées"</li>
                  <li>"Rêves Inversés"</li>
                  <li>"Cathédrale de Néons"</li>
                  <li>"Cendres et Reflets"</li>
                  <li>"Symphonie pour un Labyrinthe"</li>
                  <li>"la peau de l'étranger(ft marine le pen)"</li>
                </ul>
              </div>
            </div>
            <p className='red bold'>Available in {timeLeft}</p>
          </div>
        </section>
      </>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
};

export default App;