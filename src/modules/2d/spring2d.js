import Particle2D from "./particle2d.js";
import Vector2D from "./vector2d.js";

class Spring2D {
    constructor(anchor = new Particle2D(), bob = new Particle2D()) {
        this.anchor = anchor;
        this.bob = bob;
        this.velocity = new Vector2D();
        this.stiffness = 0.01;
        this.restLength = 150;
        this.maxLength = 500;
        this.damping = 0.99;
        this.style = {
            visible: true,
            strokeColor: "black"
        }
    }
    update() {
        const force = this.bob.position.copy().subtract(this.anchor.position);
        const x = force.magnitude() - this.restLength;
        force.normalize();
        force.scalarMultiply(this.stiffness * -1 * x);
        this.velocity.add(force);
        
        if (!this.bob.isHeldByMouse || !this.bob.fixed) {
            this.bob.applyForce(this.velocity);
        }
        
        this.velocity.scalarMultiply(-1);

        if (!this.anchor.isHeldByMouse || !this.anchor.fixed) {
            this.anchor.applyForce(this.velocity);
        }

        this.velocity.scalarMultiply(this.damping);
    }
    show(pen) {
        if (!this.style.visible) return;

        pen.beginPath();
        pen.strokeStyle = this.style.strokeColor;
        pen.moveTo(this.anchor.position.x, this.anchor.position.y);
        pen.lineTo(this.bob.position.x, this.bob.position.y);
        pen.stroke();
    }
}

export default Spring2D;