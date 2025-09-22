import { useEffect, useState } from 'react';
import axios from 'axios';
import './RevealScreen.css';
import LoadingBar from './loadingBar'; 

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
  const [isLoading, setIsLoading] = useState(false);


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
  }, [charIndex, currentLine, lines.length]); 

  const handleSubmit = async () => {
    setRoast(false)
    setIsLoading(true); 
    try { 
        if (profileLink.includes('linkedin')){
          let response = await axios.post("https://roast-io.onrender.com/linkedin", {"username": profileLink})
          setShowButtons(false)
          setPlatform(null)
          let rawData= response.data.message
          console.log(rawData)
          setRoast(rawData.split("||"))
          setShowButtons(true)

        } 
        else {
            let response = await axios.post("https://roast-io.onrender.com/githubRepo", {"username": profileLink} )
            setPlatform(null)
            setShowButtons(false)
            setGithubRepos(response.data.data)
            setShowGithubRepos(true)
            setShowButtons(true)
        }
    } catch (error) {
        console.error("API call failed:", error);
    } finally {
        setIsLoading(false); 
    }
  };

  const handleRepoRoast = async (repo) => {
    setIsLoading(true);
    try { 
        let response = await axios.post("https://roast-io.onrender.com/githubCommits", {"username": profileLink, "repo" : repo})
        let rawData= response.data.message
        console.log(rawData)
        setRoast(rawData.split("||"))
        setShowGithubRepos(false)
    } catch (error) {
        console.error("API call failed:", error);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="reveal-container">
      <pre className="typewriter">
        {displayedText}
        <span className="cursor">|</span>
      </pre>

      {isLoading && <LoadingBar />}
      { showGithubRepos && !isLoading && (
        <>
        <h2>Choose A Github Repo You Want To Roast:<br /></h2>
        <div className='button-group vertical'>
        {
        githubRepos.map((repo, index) => (
                <button
                  key={index}
                  className="cta full center"
                  onClick={() => handleRepoRoast(repo)}
                  disabled={isLoading}
                >
                  {repo}
                </button>
        ))
      }
      </div>
      </>)
      }
      { roast && !isLoading && (
        <>
        <h2>{profileLink.includes("linkedin")? "Profile, Punctured. ": "Code, Consequence."}</h2>
        <div className='button-group vertical'>
        {
        roast.map((repo, index) => (
                <button
                  key={index}
                  className="cta full center roasts"
                >
                  <div className='typewriter roast'>{repo.trim()}</div>
                </button>
        ))
      }
      </div>
      </>)
      }

      {showButtons && !platform && !isLoading && (
        <div className="button-group vertical">
          <button className="cta full" onClick={() => setPlatform('LinkedIn')}>
            🔗 Roast my LinkedIn
          </button>
          <button className="cta full" onClick={() => setPlatform('GitHub')}>
            🐙 Roast my GitHub
          </button>
        </div>
      )}

      {platform && !isLoading && (
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
            disabled={isLoading}
          />
          <br />
          <button className="cta full center" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Roast Me'}
          </button>
        </div>
      )}
      
    </div>
  );
}

export default RevealScreen;