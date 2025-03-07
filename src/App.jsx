import React, { useState } from 'react';
import GameWrapper from './game/GameWrapper'; // Import the GameWrapper component
import LandingPage from './game/LandingPage';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div>
      {!gameStarted ? (
        <LandingPage startGame={startGame} />
      ) : (
        <GameWrapper />
      )}
    </div>
  );
};

export default App;
