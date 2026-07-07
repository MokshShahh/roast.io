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
  const [validationError, setValidationError] = useState('');

  const validateAndParseGithub = (input) => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { isValid: false, error: 'GitHub username or link cannot be empty.' };
    }

    let username = trimmed;
    // Extract username from various GitHub link formats
    const urlPattern = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)/i;
    const match = trimmed.match(urlPattern);
    if (match) {
      username = match[1];
    } else if (trimmed.includes('/') || trimmed.includes('.')) {
      return { isValid: false, error: 'Invalid GitHub URL. Please enter a valid profile URL or username.' };
    }

    // GitHub usernames: 1-39 chars, alphanumeric and single hyphens, not starting/ending with hyphen.
    const usernamePattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!usernamePattern.test(username)) {
      return { isValid: false, error: 'Invalid GitHub username. It should contain only alphanumeric characters and single internal hyphens.' };
    }

    return { isValid: true, username };
  };

  const validateAndParseLinkedin = (input) => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { isValid: false, error: 'LinkedIn username or link cannot be empty.' };
    }

    // If it looks like a URL
    if (trimmed.includes('/') || trimmed.includes('.')) {
      const linkedinPattern = /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^/]+)/i;
      const match = trimmed.match(linkedinPattern);
      if (!match) {
        return { isValid: false, error: 'Invalid LinkedIn URL. Please enter a valid profile URL (e.g., linkedin.com/in/username).' };
      }
      const username = match[1].split(/[?#]/)[0]; // Remove query params/hashes
      if (!username) {
        return { isValid: false, error: 'Could not extract username from LinkedIn URL.' };
      }
      return { isValid: true, url: `https://www.linkedin.com/in/${username}/` };
    }

    // Direct username validation (3-100 characters, alphanumeric and hyphens/underscores)
    const usernamePattern = /^[a-z0-9-_]{3,100}$/i;
    if (!usernamePattern.test(trimmed)) {
      return { isValid: false, error: 'Invalid LinkedIn username. It should be 3-100 alphanumeric characters, hyphens, or underscores.' };
    }

    return { isValid: true, url: `https://www.linkedin.com/in/${trimmed}/` };
  };

  const handleSelectPlatform = (selectedPlatform) => {
    setPlatform(selectedPlatform);
    setProfileLink('');
    setValidationError('');
  };

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
    setRoast(false);
    setValidationError('');

    if (platform === 'LinkedIn') {
      const validationResult = validateAndParseLinkedin(profileLink);
      if (!validationResult.isValid) {
        setValidationError(validationResult.error);
        return;
      }

      setIsLoading(true); 
      try { 
          let response = await axios.post("https://roast-io.onrender.com/linkedin", {"username": validationResult.url});
          setShowButtons(false);
          setPlatform(null);
          let rawData= response.data.message;
          console.log(rawData);
          setRoast(rawData.split("||"));
          setShowButtons(true);
      } catch (error) {
          console.error("API call failed:", error);
          setValidationError("Failed to reach roast server. Please try again.");
      } finally {
          setIsLoading(false); 
      }
    } 
    else if (platform === 'GitHub') {
      const validationResult = validateAndParseGithub(profileLink);
      if (!validationResult.isValid) {
        setValidationError(validationResult.error);
        return;
      }

      // Store the cleaned username so that subsequent calls like handleRepoRoast use the clean username.
      setProfileLink(validationResult.username);

      setIsLoading(true); 
      try { 
          let response = await axios.post("https://roast-io.onrender.com/githubRepo", {"username": validationResult.username});
          setPlatform(null);
          setShowButtons(false);
          setGithubRepos(response.data.data);
          setShowGithubRepos(true);
          setShowButtons(true);
      } catch (error) {
          console.error("API call failed:", error);
          setValidationError("Failed to reach roast server or user not found. Please try again.");
      } finally {
          setIsLoading(false); 
      }
    }
  };

  const handleRepoRoast = async (repo) => {
    setIsLoading(true);
    setValidationError('');
    try { 
        let response = await axios.post("https://roast-io.onrender.com/githubCommits", {"username": profileLink, "repo" : repo})
        let rawData= response.data.message
        console.log(rawData)
        setRoast(rawData.split("||"))
        setShowGithubRepos(false)
    } catch (error) {
        console.error("API call failed:", error);
        setValidationError("Failed to generate roast for repository commits.");
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
          <button className="cta full" onClick={() => handleSelectPlatform('LinkedIn')}>
            🔗 Roast my LinkedIn
          </button>
          <button className="cta full" onClick={() => handleSelectPlatform('GitHub')}>
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
            onChange={(e) => {
              setProfileLink(e.target.value);
              if (validationError) setValidationError('');
            }}
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
          {validationError && (
            <p style={{ color: '#ff4d4d', fontSize: '0.9rem', marginTop: '-0.5rem', marginBottom: '1rem', textAlign: 'left' }}>
              {validationError}
            </p>
          )}
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