import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import '../styles/components/final-page.scss';
import ArtCanvas from './ArtCanvas';

interface FinalPageProps {
  timeLeft: number;
}

const FinalPage: React.FC<FinalPageProps> = ({ timeLeft }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    const handleMouseEnter = () => {
      gsap.to(imgElement, { rotation: 360, duration: 1 });
    };

    const handleMouseLeave = () => {
      gsap.to(imgElement, { rotation: 0, duration: 1 });
    };

    gsap.set(imgElement, { rotation: 0 });
    imgElement.addEventListener('mouseenter', handleMouseEnter);
    imgElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      imgElement.removeEventListener('mouseenter', handleMouseEnter);
      imgElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <> 
      <section id='ShowAlbumSection'>
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
          {/* <img src='public/assets/image/cover.png' alt='cover' /> */}
          <ArtCanvas />
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
      </section>
    </>
  );
};

export default FinalPage;