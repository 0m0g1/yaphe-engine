import Particle2D from "./particle2d.js";
import Vector2D from "./vector2d.js";

class Spring2D {
    constructor(anchor = new Particle2D(), bob = new Particle2D()) {
        this.anchor = anchor;
        this.bob = bob;
        this.velocity = new Vector2D();
        this.k = 0.01;
        this.restLength = 150;
        this.maxLength = 500;
    }
    update() {
        const force = this.bob.position.copy().subtract(this.anchor.position);
        const x = force.magnitude() - this.restLength;
        force.normalize();
        force.scalarMultiply(this.k * -1* x);
        this.velocity.add(force);
        
        if (!this.bob.isHeldByMouse || !this.bob.fixed) {
            this.bob.applyForce(this.velocity);
        }
        
        this.velocity.scalarMultiply(-1);

        if (!this.anchor.isHeldByMouse || !this.anchor.fixed) {
            this.anchor.applyForce(this.velocity);
        }

        this.velocity.scalarMultiply(0.99);

        const delta = this.bob.position.copy().subtract(this.anchor.position);
        const displacement = this.anchor.position.distanceTo(this.bob.position);
        const difference = this.restLength - displacement;
        
        if (difference > 0) return;

        const percentage = (difference / displacement) / 2;

        const offset = delta.scalarMultiply(percentage);
        
        if (!this.anchor.isHeldByMouse && !this.anchor.fixed) {
            this.anchor.position.subtract(offset);
        }
        if (!this.bob.isHeldByMouse && !this.bob.fixed) {
            this.bob.position.add(offset);
        }

    }
    show(pen) {
        pen.beginPath();
        pen.moveTo(this.anchor.position.x, this.anchor.position.y);
        pen.lineTo(this.bob.position.x, this.bob.position.y);
        pen.stroke();
        
        pen.beginPath();
        pen.arc(this.anchor.position.x, this.anchor.position.y, 5, 0, 2  * Math.PI);
        pen.arc(this.bob.position.x, this.bob.position.y, 5, 0, 2  * Math.PI);
        pen.fill();
    }
}

export default Spring2D;