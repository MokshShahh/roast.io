import { useNavigate } from 'react-router-dom';
import horizontal from './horizontal-pic.png';
import '../App.css';

function Hero() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/loading');
    };

    return (
        <div className="hero">
            <h1>From Commits to Cringe:<br />Let’s Review You</h1>
            <p className="subtitle">Your connections won't save you now.<br />Not even that VP in your network.</p>
            <button className="cta" onClick={handleClick}>
                Find Out
            </button>
            <br />
            <img src={horizontal} alt="Logo" style={{ width: '700px', marginTop: '10px' }} />
            <div className="footer-wrapper">
                <div className="footer-bar">
                    <span className="small-text">a project by </span>
                    <span className="big-text">GDSC</span>
                </div>
                <div className="footer-main">
                    © {new Date().getFullYear()} roast.io
                </div>
            </div>



        </div>
    );
}

export default Hero;
