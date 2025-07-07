import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RevealScreen.css';

function RevealScreen() {
  const navigate = useNavigate();

  const lines = [
    "Hi, I'm an A.I. trained to roast your professional presence.",
    "To get started, I'll need to see your LinkedIn or GitHub.",
    "I'm just gonna peek — no posts, no changes. Just brutal honesty."
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (currentLine < lines.length) {
      if (charIndex < lines[currentLine].length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + lines[currentLine][charIndex]);
          setCharIndex(charIndex + 1);
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        const nextLineDelay = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setDisplayedText(prev => prev + '\n');
          setCharIndex(0);
        }, 500);
        return () => clearTimeout(nextLineDelay);
      }
    } else {
      setTimeout(() => setShowButtons(true), 600);
    }
  }, [charIndex, currentLine]);

  return (
    <div className="reveal-container">
      <pre className="typewriter">
        {displayedText}
        <span className="cursor">|</span>
      </pre>

      {showButtons && (
        <div className="button-group vertical">
          <button className="cta full" onClick={() => navigate('/linkedin')}>
            🔗 Log in with LinkedIn
          </button>
          <button className="cta full" onClick={() => navigate('/github')}>
            🐙 Log in with GitHub
          </button>
          <button className="ghost">how do you know what's cringe?</button>
        </div>
      )}
    </div>
  );
}

export default RevealScreen;
