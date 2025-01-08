import React from 'react';
import ArtCanvas from './components/ArtCanvas';
import './styles/pages/test-page.scss';

const TestPage: React.FC = () => {
  return (
    <div className="test-page">
      <section id='header'>
        <div className='go_back'>
          <a href='/'>
            <img src='public/assets/image/star.svg' alt='star' />
          </a>
          <p>GO BACK</p>
        </div>
      </section>
      
      <main className="test-content">
        <h1>Canvas Test Page</h1>
        <ArtCanvas />
      </main>
    </div>
  );
};

export default TestPage;