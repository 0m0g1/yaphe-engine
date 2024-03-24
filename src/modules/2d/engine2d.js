import Particle2D from "./particle2d.js";
import YaphePath2D from "./path2d.js";
import Vector2D from "./vector2d.js";

class Engine2D{
  constructor(particles = [], path = new YaphePath2D()){
    this.particle = new Particle2D();
    this.attachedParticles = particles;
    this.path = path;
    this.updateFunction = null;
  }
  setUpdateFunction(func) {
    this.updateFunction = func;
  }
  update() {
    const point = this.updateFunction(this);
    this.particle.position.x = point.x;
    this.particle.position.y = point.y;
    this.attachedParticles.forEach((particle) => {
        particle.position.x = point.x;
        particle.position.y = point.y;
    });
  }
  show(pen) {
    this.particle.show(pen);
    this.path.show(pen);
  }
}

export default Engine2D;