import React, { useState } from 'react';
import './LandingPage.css'; // Make sure to create a separate CSS file for styling
import AboutPage from './about.jsx';

const LandingPage = ({ startGame }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleAboutClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="landing-container">
      <div className="game-title">Zombie Survival</div>
      <div className="description">
        <p>Survive waves of zombies, shoot them down, and collect ammo to stay alive!</p>
      </div>
      <div className="button-container">
        <button className="start-btn" onClick={startGame}>Start Game</button>
        <button className="about-btn" onClick={handleAboutClick}>About</button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <AboutPage />
            <button className="close-btn" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
