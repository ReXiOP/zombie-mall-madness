import React from 'react';
import './LandingPage.css'; // Make sure to create a separate CSS file for styling

const LandingPage = ({ startGame }) => {
  return (
    <div className="landing-container">
      <div className="game-title">Zombie Survival</div>
      <div className="description">
        <p>Survive waves of zombies, shoot them down, and collect ammo to stay alive!</p>
      </div>
      <div className="button-container">
        <button className="start-btn" onClick={startGame}>Start Game</button>
        <button className="about-btn">About</button>
      </div>
    </div>
  );
};

export default LandingPage;
