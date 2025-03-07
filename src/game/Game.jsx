import React, { useEffect } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene"; // Ensure you have GameScene.js

const Game = () => {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth, // Make it full screen
      height: window.innerHeight,
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scene: [GameScene], // Ensure GameScene is correctly imported
    };

    let game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
};

export default Game;
