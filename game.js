// game.js
const socket = io();

let playerId;
let players = {};
let zombies = [];
let bullets = [];
let health = 100;
let score = 0;
let canShoot = true;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload() {
  // Load images for player, zombie, gun, fire, and background
  this.load.image("background", "/assets/background.jpg");
  this.load.image("player", "/assets/player.png");
  this.load.image("zombie", "/assets/zombie.png");
  this.load.image("gun", "/assets/gun.png");
  this.load.image("fire", "/assets/fire.png");
}

function create() {
  // Background
  this.add.image(400, 300, "background");

  // Create the player's sprite and initialize physics
  playerId = Phaser.Math.Between(1, 1000); // Random player ID for now
  players[playerId] = this.add.sprite(400, 300, "player").setOrigin(0.5, 0.5);
  this.physics.add.existing(players[playerId]);

  // Create zombies
  for (let i = 0; i < 5; i++) {
    const zombie = this.add.sprite(Math.random() * 800, Math.random() * 600, "zombie");
    zombie.setOrigin(0.5, 0.5);
    this.physics.add.existing(zombie);
    zombies.push(zombie);
  }

  // Gun and fire sprite
  this.gun = this.add.sprite(400, 300, "gun").setOrigin(0.5, 0.5);

  // Create text for health and score
  this.healthText = this.add.text(10, 10, `Health: ${health}`, { fontSize: '16px', fill: '#fff' });
  this.scoreText = this.add.text(10, 30, `Score: ${score}`, { fontSize: '16px', fill: '#fff' });

  // Bullet group
  this.bulletGroup = this.physics.add.group({
    defaultKey: "fire",
    maxSize: 10,
  });

  // Listen for player movement from other clients
  socket.on("currentPlayers", (currentPlayers) => {
    players = currentPlayers;
    for (let id in players) {
      if (!players[id].sprite) {
        players[id].sprite = this.add.sprite(players[id].x, players[id].y, "player").setOrigin(0.5, 0.5);
        this.physics.add.existing(players[id].sprite);
      }
    }
  });

  // Listen for player updates (position, etc.)
  socket.on("updatePlayers", (updatedPlayers) => {
    players = updatedPlayers;
    for (let id in players) {
      if (players[id].sprite) {
        players[id].sprite.setPosition(players[id].x, players[id].y);
      }
    }
  });

  // Listen for shooting actions from other players
  socket.on("shooting", (data) => {
    const bullet = this.bulletGroup.get();
    if (bullet) {
      bullet.setPosition(data.x, data.y);
      this.physics.moveTo(bullet, this.input.x, this.input.y, 500);
    }
  });
}

function update() {
  // Player movement using keyboard input
  if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).isDown) {
    players[playerId].x -= 3;
  } else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).isDown) {
    players[playerId].x += 3;
  }

  if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).isDown) {
    players[playerId].y -= 3;
  } else if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).isDown) {
    players[playerId].y += 3;
  }

  // Emit player movement
  socket.emit("move", { x: players[playerId].x, y: players[playerId].y });

  // Shooting logic
  if (this.input.activePointer.isDown && canShoot) {
    const bullet = this.bulletGroup.get();
    if (bullet) {
      bullet.setPosition(players[playerId].x, players[playerId].y);
      this.physics.moveTo(bullet, this.input.x, this.input.y, 500);
      socket.emit("shoot", { x: players[playerId].x, y: players[playerId].y });
      canShoot = false;

      // Reset shoot cooldown
      this.time.delayedCall(300, () => {
        canShoot = true;
      });
    }
  }

  // Update zombie positions (AI)
  zombies.forEach((zombie) => {
    this.physics.moveToObject(zombie, players[playerId], 50);
  });

  // Check for collisions between player bullets and zombies
  this.physics.overlap(this.bulletGroup, zombies, (bullet, zombie) => {
    bullet.setActive(false).setVisible(false); // Deactivate bullet
    zombie.setActive(false).setVisible(false); // Deactivate zombie
    score += 5;
    this.scoreText.setText(`Score: ${score}`);
  });

  // Check for collisions between player and zombies
  this.physics.overlap(players[playerId].sprite, zombies, () => {
    health -= 10;
    score += 1;
    this.healthText.setText(`Health: ${health}`);
    this.scoreText.setText(`Score: ${score}`);
  });
}
