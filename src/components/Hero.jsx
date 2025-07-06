import { useState } from 'react';
import logo from './logo.png';

function Hero() {
  const [platform, setPlatform] = useState(null);
  const [profileLink, setProfileLink] = useState('');

  const handlePlatformClick = (selected) => {
    setPlatform(selected);
    setProfileLink('');
  };

  const handleSubmit = () => {
    alert(`Roasting your ${platform} profile: ${profileLink}`);
  };

  return (
    <div className="hero">
      <h1>From Commits to Cringe:<br />Let’s Review You</h1>

      <p className="subtitle">Your connections won't save you now.</p>

      {!platform ? (
        <div style={{ marginTop: '1.5rem' }}>
          <button className="cta" onClick={() => handlePlatformClick('linkedin')} style={{ marginRight: '1rem' }}>
            Roast My LinkedIn
          </button>

          <button className="cta" onClick={() => handlePlatformClick('github')}>
            Roast My GitHub
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <p>Enter your {platform} profile link:</p>
          <input
            type="text"
            placeholder={`Paste your ${platform} profile URL`}
            value={profileLink}
            onChange={(e) => setProfileLink(e.target.value)}
            style={{
              padding: '0.6rem',
              width: '70%',
              maxWidth: '400px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: '1rem',
            }}
          />
          <br />
          <button className="cta" onClick={handleSubmit} disabled={!profileLink}>
            Roast Me
          </button>
        </div>
      )}

      <br />
      <img src={logo} alt="Logo" style={{ width: '300px', marginTop: '20px' }} />
    </div>
  );
}

export default Hero;
