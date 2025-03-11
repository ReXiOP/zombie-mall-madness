import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About the Game</h1>
        <p>
          Welcome to our exciting multiplayer zombie survival game! Fight against waves of relentless zombies in an immersive environment filled with action and strategy. The game features:
        </p>
        <ul>
          <li><strong>Multiplayer Experience:</strong> Join forces with other players online to take down zombies and survive the apocalypse.</li>
          <li><strong>Dynamic Gameplay:</strong> Players can move, aim, and shoot, with the added challenge of ammo management and health survival.</li>
          <li><strong>Customizable Controls:</strong> Fully optimized for both desktop and mobile play, providing a seamless gaming experience.</li>
          <li><strong>Unique Features:</strong> Automatic zombie spawning, collectible ammo boxes, and an evolving difficulty level.</li>
        </ul>

        <h2>About the Developer</h2>
        <p>
          This game was created by <strong>Muhammad Sajid</strong>, a passionate game developer and AI enthusiast. With years of experience in game development, I aim to create engaging and immersive experiences for players worldwide.
        </p>
        <p>
          You can explore my work and get in touch through my portfolio: 
          <a href="https://sajid09.netlify.app/" target="_blank" rel="noopener noreferrer">Muhammad Sajid Portfolio</a>
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
