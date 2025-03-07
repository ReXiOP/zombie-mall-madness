export default class Player {
    constructor(scene, x, y, id) {
      this.scene = scene;
      this.id = id;
      this.sprite = scene.physics.add.sprite(x, y, "player").setScale(1.2);
      this.health = 100;
  
      scene.input.on("pointermove", (pointer) => {
        let angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, pointer.x, pointer.y);
        this.sprite.setRotation(angle);
      });
  
      scene.input.on("pointerdown", (pointer) => {
        this.shoot(pointer);
      });
    }
  
    setPosition(x, y) {
      this.sprite.setPosition(x, y);
    }
  
    shoot(pointer) {
      this.scene.socket.emit("shoot", {
        x: this.sprite.x,
        y: this.sprite.y,
        targetX: pointer.x,
        targetY: pointer.y,
      });
    }
  }
  