import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/components/final-page.scss';
import ArtCanvas from './ArtCanvas';
import Countdown from './Countdown';

interface FinalPageProps {
  timeLeft: number;
  onBack: () => void;
}

const FinalPage: React.FC<FinalPageProps> = ({ timeLeft, onBack }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const arrow = document.querySelector('.scroll-arrow svg');
  
  useEffect(() => {
    if (arrow) {
      gsap.fromTo(
        arrow,
        { y: 0 },
        { 
          y: 20, 
          duration: 1, 
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true 
        }
      );
    }
  }, [arrow]);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      gsap.to(imgRef.current, { rotation: 360, duration: 1 });
    }
  };

  const handleMouseLeave = () => {
    if (imgRef.current) {
      gsap.to(imgRef.current, { rotation: 0, duration: 1 });
    }
  };

  return (
    <> 
      <section id='ShowAlbumSection'>
        <section id='header'>
          <div className='go_back' onClick={onBack} style={{ cursor: 'pointer' }}>
            <img 
              ref={imgRef}
              src='public/assets/image/star.svg' 
              alt='star'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <p>GO BACK</p> 
          </div>
        </section>

        <section id='title'>
          <div className='title-align'>
            <h1>P.LATINIU.M</h1>
            <h3>LIKE A CRY.</h3>
          </div>
          <h2>"VOTRE COEUR PARLE POUR VOUS"</h2>
        </section>

        <section id='arrow'>
          <div id='canvas-container'>
            <div id='canvas'>
              <img src='public/assets/image/cover.png' alt='cover' />
              <ArtCanvas />
            </div>
          </div>

          <div id='content'>
            <div className='content-align'>
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
              <Countdown initialSeconds={timeLeft} />
            </div>
          </div>
        </section>
      </section>

      <section id='footer'>
        <iframe 
          src="https://open.spotify.com/embed/artist/0LnhY2fzptb0QEs5Q5gM7S?utm_source=generator&theme=0" 
          width="100%" 
          height="352" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
        />
      </section>   
    </>
  );
};

export default FinalPage;