import { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [roast, setRoast] = useState(false);
  const [showGithubRepos, setShowGithubRepos] = useState(false)
  const [githubRepos, setGithubRepos] = useState()


  useEffect(() => {
    if (currentLine < lines.length) {
      if (charIndex < lines[currentLine].length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + lines[currentLine][charIndex]);
          setCharIndex(charIndex + 1);
        }, 1);
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

  const handleSubmit = async () => {
    setGithubRepos("Loading...")
    setTimeout(()=>{}, 200)
    let response = await axios.post("http://127.0.0.1:8080/githubRepo", {"username": profileLink} )
    setPlatform(null)
    setShowButtons(false)
    setGithubRepos(response.data.data)
    setShowGithubRepos(true)
  };

  const handleRepoRoast = async (repo) => {
    let response = await axios.post("http://127.0.0.1:8080/githubCommits", {"username": profileLink, "repo" : repo})
    let rawData= response.data.message
    console.log(rawData)
    setRoast(rawData.split("||"))
    setShowGithubRepos(false)

  }

  return (
    <div className="reveal-container">
      <pre className="typewriter">
        {displayedText}
        <span className="cursor">|</span>
      </pre>

      {showButtons && !platform && (
        <div className="button-group vertical">
          <button className="cta full" onClick={() => setPlatform('LinkedIn')}>
            🔗 Roast my LinkedIn
          </button>
          <button className="cta full" onClick={() => setPlatform('GitHub')}>
            🐙 Roast my GitHub
          </button>
        </div>
      )}

      {platform && (
        <div style={{ marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
          <p>Enter your {platform} profile url or username:</p>
          <input
            type="text"
            value={profileLink}
            onChange={(e) => setProfileLink(e.target.value)}
            placeholder={`Paste your ${platform} profile URL:`}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '8px',
              fontSize: '1rem',
              marginBottom: '1rem',
              color: 'black'
            }}
          />
          <br />
          <button className="cta full center" onClick={handleSubmit}>
            Roast Me
          </button>
        </div>
      )}
      { showGithubRepos && (
        <div className='button-group vertical'>
        {
        githubRepos.map((repo, index) => (
                <button
                  key={index}
                  className="cta full center" 
                  onClick={() => handleRepoRoast(repo)}
                >
                  {repo}
                </button>
        ))
      }
      </div>)
      }
      { roast && (
        <div className='button-group vertical'>
        {
        roast.map((repo, index) => (
                <button
                  key={index}
                  className="cta full center roasts" 
                  onClick={() => handleRepoRoast(repo)}
                >
                  {repo}
                </button>
        ))
      }
      </div>)
      }
    </div>
  );
}

export default RevealScreen;
