import YaphePath2D from "./path2d.js";
import Vector2D from "./vector2d.js";

class Engine2D{
  constructor(particles = [], path = new YaphePath2D()){
    this.position = new Vector2D();
    this.attachedParticles = particles;
    this.path = path;
    this.updateFunction = null;
  }
  setUpdateFunction(func) {
    this.updateFunction = func;
  }
  update() {
    const point = this.updateFunction(this);
    this.position.x = point.x;
    this.position.y = point.y;
    this.attachedParticles.forEach((particle) => {
        particle.position.x = point.x;
        particle.position.y = point.y;
    });
  }
  show(pen) {
    pen.beginPath();
    pen.arc(this.position.x, this.position.y, 20, 0, 2 * Math.PI);
    pen.fill();
    this.path.show(pen);
  }
}

export default Engine2D;