export default class Bullet {
    constructor(scene, x, y, targetX, targetY) {
      this.scene = scene;
      this.sprite = scene.physics.add.sprite(x, y, "bullet");
  
      let angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
      scene.physics.velocityFromRotation(angle, 500, this.sprite.body.velocity);
  
      scene.physics.add.overlap(this.sprite, scene.zombies, this.hitZombie, null, this);
    }
  
    hitZombie(bullet, zombie) {
      bullet.destroy();
      zombie.health -= 25;
      if (zombie.health <= 0) {
        zombie.destroy();
        this.scene.game.increaseScore(10);
      }
    }
  }
  