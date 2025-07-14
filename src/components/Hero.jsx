import { useNavigate } from 'react-router-dom';
import horizontal from './horizontal-pic.png';
import '../App.css';

function Hero() {
    const navigate = useNavigate();

    return (
        <div className="hero">
            <h1>From Commits To Cringe:<br />Let’s Review You</h1>
            <p className="subtitle">Your connections won't save you now.<br />Not even that VP in your network.</p>
            <button className="cta" onClick={()=>{navigate('./loading')}}>
                Find Out
            </button>
            <br />
            <img src={horizontal} alt="Logo" style={{ width: '700px', marginTop: '10px' }} />
            <div className="footer-wrapper">
                <div className="footer-bar">
                    <div className="small-text">A project by </div>
                    <div className="big-text text-align-right">DCxGDG</div>
                </div>
                <div className="footer-main">
                    © {new Date().getFullYear()} roast.io
                </div>
            </div>



        </div>
    );
}

export default Hero;
