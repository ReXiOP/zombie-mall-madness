export default class Zombie {
    constructor(scene, x, y) {
      this.scene = scene;
      this.sprite = scene.physics.add.sprite(x, y, "zombie").setScale(1.5);
      this.health = 50;
  
      scene.physics.moveToObject(this.sprite, scene.player.sprite, 40);
  
      scene.physics.add.overlap(this.sprite, scene.player.sprite, this.attackPlayer, null, this);
    }
  
    attackPlayer(zombie, player) {
      this.scene.socket.emit("playerHit", player.health - 10);
      console.log("Zombie attacked player! Player Health:", player.health);
    }
  }
  