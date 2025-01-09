import React, { useState, useEffect } from 'react';
import '../styles/components/countdown.scss';

interface CountdownProps {
  initialSeconds: number;
}

const formatTime = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const Countdown: React.FC<CountdownProps> = ({ initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <p className="release-info">DISPONIBLE LE 21 JANVIER 2025 À 00H00</p>
      <div className="countdown">
        <div className="time-display">{formatTime(seconds)}</div>
      </div>
    </div>
  );
};

export default Countdown;