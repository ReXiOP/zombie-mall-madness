import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.players = {};
    this.ammo = 30; // Initial ammo
    this.health = 100; // Player's initial health
    this.score = 0; // Initial score
    this.zombies = [];
  }

  preload() {
    // Load assets
    this.load.image('background', 'assets/back.png');
    this.load.image("player", "assets/player.png");
    this.load.image("zombie", "assets/zombie.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("ammoBox", "assets/ammoBox.png"); // Load ammo box image
  }

  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
    // Create player sprite and set size
    this.player = this.physics.add.sprite(400, 300, "player").setOrigin(0.5, 0.5);
    this.player.setDisplaySize(40, 40); // Set player size to 40px
    this.player.setCollideWorldBounds(true); // Ensure the player stays inside the game world
    this.player.body.setGravityY(0); // Disable gravity to prevent player from falling

    this.cursors = this.input.keyboard.createCursorKeys(); // Handle player movement with arrow keys

    // Display texts
    this.ammoText = this.add.text(10, 10, `Ammo: ${this.ammo}`, {
      font: "16px Arial",
      fill: "#fff",
    });

    this.healthText = this.add.text(10, 30, `Health: ${this.health}`, {
      font: "16px Arial",
      fill: "#fff",
    });

    this.scoreText = this.add.text(10, 50, `Score: ${this.score}`, {
      font: "16px Arial",
      fill: "#fff",
    });

    // Create zombie group
    this.zombieGroup = this.physics.add.group();
    this.createZombies(5); // Create 5 initial zombies

    // Create ammo box group
    this.ammoBoxes = this.physics.add.group();
    this.createAmmoBox(); // Create ammo box at random position

    // Collisions
    this.physics.add.collider(this.player, this.zombieGroup, this.playerHit, null, this);
    this.physics.add.collider(this.player, this.ammoBoxes, this.collectAmmo, null, this); // Ammo box interaction

    // Shoot on mouse left click
    this.input.on("pointerdown", this.shoot, this);
  }

  update() {
    // Player movement with cursor keys, only move if a key is pressed
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160); // Move left
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160); // Move right
    } else {
      this.player.setVelocityX(0); // Stop movement in X axis when no key is pressed
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160); // Move up
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160); // Move down
    } else {
      this.player.setVelocityY(0); // Stop movement in Y axis when no key is pressed
    }

    // Zombies movement towards player
    this.zombieGroup.getChildren().forEach((zombie) => {
      this.physics.moveToObject(zombie, this.player, 40); // Zombies move towards player with speed 40
    });

    // Update ammo, health, and score display
    this.ammoText.setText(`Ammo: ${this.ammo}`);
    this.healthText.setText(`Health: ${this.health}`);
    this.scoreText.setText(`Score: ${this.score}`);
  }

  createZombies(count) {
    for (let i = 0; i < count; i++) {
      let x = Phaser.Math.Between(100, 700);
      let y = Phaser.Math.Between(100, 500);
      let zombie = this.physics.add.sprite(x, y, "zombie").setOrigin(0.5, 0.5);
      zombie.setDisplaySize(40, 40); // Set zombie size to 40px
      zombie.setCollideWorldBounds(true); // Prevent zombies from going out of bounds
      this.zombieGroup.add(zombie);
    }
  }

  createAmmoBox() {
    // Spawn ammo box at random position
    let x = Phaser.Math.Between(100, 700);
    let y = Phaser.Math.Between(100, 500);
    let ammoBox = this.physics.add.sprite(x, y, "ammoBox").setOrigin(0.5, 0.5);
    ammoBox.setDisplaySize(40, 40); // Set ammo box size to 40px
    this.ammoBoxes.add(ammoBox);
  }

  shoot() {
    if (this.ammo <= 0) {
      console.log("No ammo left!");
      return; // Do nothing if ammo is 0
    }

    // Create bullet and set size
    let bullet = this.physics.add.sprite(this.player.x, this.player.y, "bullet").setOrigin(0.5, 0.5);
    bullet.setDisplaySize(20, 20); // Set bullet size to 20px
    this.physics.moveTo(bullet, this.input.x, this.input.y, 500); // Move the bullet toward the mouse pointer

    // Decrease ammo
    this.ammo -= 1;

    // Check bullet collisions with zombies
    this.physics.add.collider(bullet, this.zombieGroup, this.killZombie, null, this);
  }

  killZombie(bullet, zombie) {
    bullet.destroy(); // Destroy the bullet
    zombie.destroy(); // Destroy the zombie
    this.score += 10; // Increase score when zombie is killed
    this.createZombies(1); // Create a new zombie
  }

  playerHit(player, zombie) {
    this.health -= 10; // Decrease health when zombie hits player
    zombie.destroy(); // Destroy zombie when it hits player
    this.createZombies(1); // Create a new zombie
    if (this.health <= 0) {
      this.gameOver();
    }
  }

  collectAmmo(player, ammoBox) {
    ammoBox.destroy(); // Destroy the ammo box after interaction
    this.ammo += 10; // Increase ammo
    this.createAmmoBox(); // Spawn a new ammo box
  }

  gameOver() {
    // Handle game over logic (can add more here)
    this.scene.pause();
    this.add.text(200, 250, "Game Over", {
      font: "32px Arial",
      fill: "#ff0000",
    });
  }
}

export default GameScene;
