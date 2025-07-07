import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import '../App.css';

function Hero() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/loading');
  };

  return (
    <div className="hero">
      <h1>From Commits to Cringe:<br />Let’s Review You</h1>
      <p className="subtitle">Your connections won't save you now.</p>
      <button className="cta" onClick={handleClick}>
        Find Out
      </button>
      <br />
      <img src={logo} alt="Logo" style={{ width: '300px', marginTop: '20px' }} />
    </div>
  );
}

export default Hero;
