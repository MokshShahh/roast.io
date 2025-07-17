import React from 'react';
import './LoadingBar.css';

function LoadingBar() {
  return (
    <div className="loading-indicator">
      <div className="spinner"></div>
      <p>Analyzing... This might take a moment.</p>
    </div>
  );
}

export default LoadingBar;