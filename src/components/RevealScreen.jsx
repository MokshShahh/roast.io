import { useEffect, useState } from 'react';
import './RevealScreen.css';

function RevealScreen() {
  const lines = [
    "Hi, I'm an A.I. trained to roast your professional presence.",
    "To get started, I'll need to see your LinkedIn or GitHub.",
    "I'm just gonna peek — no posts, no changes. Just brutal honesty."
  ];

  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [profileLink, setProfileLink] = useState('');

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

  const handleSubmit = () => {
    alert(`Roasting your ${platform} profile:\n${profileLink}`);
    // optionally navigate or store the link
  };

  return (
    <div className="reveal-container">
      <pre className="typewriter">
        {displayedText}
        <span className="cursor">|</span>
      </pre>

      {showButtons && !platform && (
        <div className="button-group vertical">
          <button className="cta full" onClick={() => setPlatform('LinkedIn')}>
            🔗 Log in with LinkedIn
          </button>
          <button className="cta full" onClick={() => setPlatform('GitHub')}>
            🐙 Log in with GitHub
          </button>
          <button className="ghost">how do you know what's cringe?</button>
        </div>
      )}

      {platform && (
        <div style={{ marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
          <p>Enter your {platform} profile link:</p>
          <input
            type="text"
            value={profileLink}
            onChange={(e) => setProfileLink(e.target.value)}
            placeholder={`Paste your ${platform} profile URL`}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />
          <br />
          <button className="cta full" onClick={handleSubmit} disabled={!profileLink}>
            Roast Me 🔥
          </button>
        </div>
      )}
    </div>
  );
}

export default RevealScreen;
