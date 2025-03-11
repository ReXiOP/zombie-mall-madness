import Phaser from 'phaser';
import io from 'socket.io-client';

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.socket = io(); // Connect to the server
    this.players = {};
    this.ammo = 30;
    this.health = 100;
    this.score = 0;
    this.zombies = [];
    this.joystick = null;
  }

  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("zombie", "assets/zombie.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("ammoBox", "assets/ammoBox.png");
    this.load.image("joystickBase", "assets/joystickBase.png");
    this.load.image("joystickThumb", "assets/joystickThumb.png");
    this.load.image("shootButton", "assets/shootButton.png");
  }

  create() {
    this.scale.resize(window.innerWidth, window.innerHeight);
    this.scale.fullScreenScaleMode = Phaser.Scale.FIT;
    this.scale.refresh();

    // 🟢 Ensure physics is enabled for the player
    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, "player")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(40, 40);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.ammoText = this.add.text(10, 10, `Ammo: ${this.ammo}`, { font: "16px Arial", fill: "#fff" });
    this.healthText = this.add.text(10, 30, `Health: ${this.health}`, { font: "16px Arial", fill: "#fff" });
    this.scoreText = this.add.text(10, 50, `Score: ${this.score}`, { font: "16px Arial", fill: "#fff" });

    this.zombieGroup = this.physics.add.group();
    this.createZombies(5); // 🟢 Zombies should spawn properly

    this.ammoBoxes = this.physics.add.group();
    this.createAmmoBox();

    this.physics.add.collider(this.player, this.zombieGroup, this.playerHit, null, this);
    this.physics.add.collider(this.player, this.ammoBoxes, this.collectAmmo, null, this);

    this.input.on("pointerdown", this.shoot, this);

    if (!this.sys.game.device.os.desktop) {
      this.addTouchControls();
    }

    this.socket.on("playerPosition", (data) => {
      if (!this.players[data.id]) {
        this.players[data.id] = this.physics.add.sprite(data.x, data.y, "player").setDisplaySize(40, 40);
      } else {
        this.players[data.id].setPosition(data.x, data.y);
      }
    });
  }

  update() {
    let velocityX = 0;
    let velocityY = 0;

    // 🟢 Ensure player movement is updated
    if (this.cursors.left.isDown) velocityX = -160;
    else if (this.cursors.right.isDown) velocityX = 160;

    if (this.cursors.up.isDown) velocityY = -160;
    else if (this.cursors.down.isDown) velocityY = 160;

    // 🟢 Mobile joystick movement
    if (this.joystick) {
      let speed = 160;
      velocityX = this.joystick.forceX * speed;
      velocityY = this.joystick.forceY * speed;
    }

    this.player.setVelocity(velocityX, velocityY);

    // 🟢 Zombies should move toward the player
    this.zombieGroup.getChildren().forEach((zombie) => {
      this.physics.moveToObject(zombie, this.player, 40);
    });

    this.ammoText.setText(`Ammo: ${this.ammo}`);
    this.healthText.setText(`Health: ${this.health}`);
    this.scoreText.setText(`Score: ${this.score}`);

    this.socket.emit("playerPosition", {
      id: this.socket.id,
      x: this.player.x,
      y: this.player.y,
    });
  }

  // 🟢 Ensure zombies spawn properly
  createZombies(count) {
    for (let i = 0; i < count; i++) {
      let x = Phaser.Math.Between(100, this.scale.width - 100);
      let y = Phaser.Math.Between(100, this.scale.height - 100);
      let zombie = this.physics.add.sprite(x, y, "zombie").setDisplaySize(40, 40);
      this.zombieGroup.add(zombie);
    }
  }

  createAmmoBox() {
    let x = Phaser.Math.Between(100, this.scale.width - 100);
    let y = Phaser.Math.Between(100, this.scale.height - 100);
    let ammoBox = this.physics.add.sprite(x, y, "ammoBox").setDisplaySize(40, 40);
    this.ammoBoxes.add(ammoBox);
  }

  shoot() {
    if (this.ammo <= 0) return;
    let bullet = this.physics.add.sprite(this.player.x, this.player.y, "bullet").setDisplaySize(20, 20);
    this.physics.moveTo(bullet, this.input.x, this.input.y, 500);
    this.ammo -= 1;
    this.physics.add.collider(bullet, this.zombieGroup, this.killZombie, null, this);
  }

  killZombie(bullet, zombie) {
    bullet.destroy();
    zombie.destroy();
    this.score += 10;
    this.createZombies(1);
  }

  playerHit(player, zombie) {
    this.health -= 10;
    zombie.destroy();
    this.createZombies(1);
    if (this.health <= 0) this.gameOver();
  }

  collectAmmo(player, ammoBox) {
    ammoBox.destroy();
    this.ammo += 10;
    this.createAmmoBox();
  }

  gameOver() {
    this.scene.pause();
    this.add.text(this.scale.width / 2 - 50, this.scale.height / 2, "Game Over", { font: "32px Arial", fill: "#ff0000" });
  }

  addTouchControls() {
    this.joystickBase = this.add.sprite(100, this.scale.height - 100, "joystickBase").setOrigin(0.5);
    this.joystickThumb = this.add.sprite(100, this.scale.height - 100, "joystickThumb").setOrigin(0.5);
    this.shootButton = this.add.sprite(this.scale.width - 80, this.scale.height - 80, "shootButton").setInteractive();

    this.joystickBase.setScale(1.5);
    this.joystickThumb.setScale(1.5);
    this.shootButton.setScale(0.8);

    this.joystickBase.alpha = 0.7;
    this.joystickThumb.alpha = 0.7;
    this.shootButton.alpha = 0.8;

    this.joystick = this.plugins.get('rexVirtualJoystick').add(this, {
      x: 100,
      y: this.scale.height - 100,
      radius: 50,
      base: this.joystickBase,
      thumb: this.joystickThumb,
    });

    this.shootButton.on("pointerdown", () => this.shoot());
  }
}

export default GameScene;
