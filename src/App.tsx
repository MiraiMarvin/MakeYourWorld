import { useState } from 'react';
import Question from './components/Question';
import './styles/app.scss';

function App() {
 const [currentStep, setCurrentStep] = useState(0);

 const questions = [
   "Si votre esprit émettait un son, serait-il un murmure, un écho ou un cri ?",
   "Si votre cœur était une lumière, de quelle couleur brillerait-il ?", 
   "Si vous deviez visualiser votre âme, serait-elle fluide, anguleuse ou autre chose ?"
 ];


 const handleAnswer = () => {
   setCurrentStep(prev => prev + 1);
 };

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
     </section>

     <section id='title'>
       <h2>Votre cœur parle pour vous</h2>
     </section>

     <section id='canvas'>
       <canvas id='canvas' width='800' height='600'></canvas>
     </section>

     <section id='content'>
       <div>
         <h1>P.LATINIU.M</h1>
         <p>like a cry.</p>
         <p>Laylow present:</p>
         <div>
           <div>
             <ul>
               <li>Prismes Brisés(ft chuck noris)</li>
               <li>Lumière Noire</li>
               <li>Venin dans la Veine</li>
               <li>Echos d'Abîmes</li>
               <li>Os et Métal(ft zemmour)</li>
               <li>Le Silence des Ombres</li>
               <li>Sang Numérique (ft Mr anderson)</li>
             </ul>
           </div>
           <div>
             <ul>
               <li>Nuit de Chrome (ft damso)</li>
               <li>Âmes Fracturées</li>
               <li>Rêves Inversés</li>
               <li>Cathédrale de Néons</li>
               <li>Cendres et Reflets</li>
               <li>Symphonie pour un Labyrinthe</li>
               <li>la peau de l'étranger(ft marine le pen)</li>
             </ul>
           </div>
         </div>
         <p>Disponible sur toutes les plateformes le vendredi 19 juin 2025 a Minuit</p>
       </div>
     </section>
   </>
 );
}

export default App;