import YaphePath2D from "./path2d.js";
import Vector2D from "./vector2d.js";

class Engine2D{
  constructor(){
    this.position = new Vector2D();
    this.attachedParticles = [];
    this.path = new YaphePath2D();
    this.speed = 0.01;
  }
  update() {
    const point = this.path.getPointAt(this.position.x);
    this.attachedParticles.forEach((particle) => {
      particle.position.x = point.x;
      particle.position.y = point.y;
    })
  }
}

export default Engine2D;