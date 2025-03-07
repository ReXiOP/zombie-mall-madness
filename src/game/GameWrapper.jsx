import React, { useEffect } from 'react';
import Phaser from 'phaser';
import GameScene from './GameScene'; // Import the Phaser scene

const GameWrapper = () => {
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: window.innerWidth, // Make it full screen
      height: window.innerHeight,
      scene: GameScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />; // Phaser will automatically render into this div
};

export default GameWrapper;
