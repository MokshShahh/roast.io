import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingScreen.css';

function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/reveal'), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="loading-container">
      <p className="line"> Initializing roast engine...</p>
      <p className="line"> Fetching 1,234 signs of corporate cringe...</p>
      <div className="progress-bar">
        <div className="bar" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

export default LoadingScreen;
