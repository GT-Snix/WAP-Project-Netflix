import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import backdrop from './assets/backdrop_landing.webp';

function Landing() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    const cleanEmail = email.trim();
    const emailOk = cleanEmail.includes('@') && cleanEmail.endsWith('.com');

    if (!emailOk) {
        setEmailError('Please enter a valid email address.');
        console.log('invalid email:', cleanEmail);
        return;
    }

    setEmailError('');
    console.log('valid email, navigating');
    navigate('/app');
    };

  return (
    <div className="landing">
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1 className="hero-title">Unlimited movies, shows, and originals</h1>
          <p className="hero-text">Watch anywhere. Cancel anytime.</p>
          <p className="hero-subtext">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <div className="hero-form">
            <input
              className={`hero-input ${emailError ? 'hero-input-error' : ''}`}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
            />
            <button className="btn btn-primary" onClick={handleStart}>
              Get Started
            </button>
          </div>

          {emailError && <div className="hero-error">{emailError}</div>}
        </div>
      </section>
   <section className="feature">
        <div className="feature-text-wrap">
          <h2 className="feature-title-lg">Enjoy on your TV.</h2>
          <p className="feature-subtext">
            Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV,
            Blu-ray players and more.
          </p>
        </div>

        <div className="feature-media">
          <video
            className="feature-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-in-0819.m4v"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <h3 className="feature-title">Ultra HD</h3>
          <p className="feature-text">Crystal-clear streaming on supported devices.</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Offline</h3>
          <p className="feature-text">Download and watch without internet.</p>
        </div>
        <div className="feature-card">
          <h3 className="feature-title">Profiles</h3>
          <p className="feature-text">Personalized recommendations for everyone.</p>
        </div>
      </section>

      <section className="cta">
        <h2 className="cta-title">Start your free trial</h2>
        <p className="cta-text">No credit card required. Cancel anytime.</p>
        <div className="hero-form">
            <input
              className={`hero-input ${emailError ? 'hero-input-error' : ''}`}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
            />
            <button className="btn btn-primary" onClick={handleStart}>
              Get Started
            </button>
          </div>
        {emailError && <div className="hero-error">{emailError}</div>}
      </section>

      <footer className="footer">
        <span>© 2026 Streamflix</span>
        <span>Help • Terms • Privacy</span>
      </footer>
    </div>
  );
}

export default Landing;