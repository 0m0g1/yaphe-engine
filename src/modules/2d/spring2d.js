import Particle2D from "./particle2d.js";
import Vector2D from "./vector2d.js";

class Spring2D {
    constructor(anchor = new Particle2D(), bob = new Particle2D()) {
        this.anchor = anchor;
        this.bob = bob;
        this.velocity = new Vector2D();
        this.stiffness = 0.01;
        this.restLength = this.anchor.position.distanceTo(this.bob.position);
        this.maxLength = this.restLength + 50;
        this.damping = 0.99;
        this.width = 2;
        this.style = {
            visible: true,
            strokeColor: "black"
        }
    }
    getPoints() {
        const points = [];
        const numOfPoints = this.restLength / (this.width / 2);
        for (let i = 0; i <= numOfPoints; i++) {
            const t = i / numOfPoints;
            const interpolatedPoint = this.anchor.position.copy().lerp(this.bob.position, t);
            const particle = new Particle2D(interpolatedPoint.x, interpolatedPoint.y);
            particle.radius = this.width / 2;
            points.push(particle);
        }
        return points;
    }
    update() {
        if (this.isConstrained()) {
            this.constrain();
        } else {
            this.anchor.isConstrained = false;
            this.bob.isConstrained = false;
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

    }
    isConstrained() {
        const displacement = this.anchor.position.distanceTo(this.bob.position);
        return displacement > this.maxLength; 
    }
    constrain() {
        this.anchor.isConstrained = true;
        this.bob.isConstrained = true;
        const delta = this.bob.position.copy().subtract(this.anchor.position);
        const displacement = this.anchor.position.distanceTo(this.bob.position);
        const difference = this.maxLength - displacement;
        // Calculate offset based on percentage of difference
        const percentage = (difference / displacement) / 2;
        const offset = delta.scalarMultiply(percentage);

        // Apply offset to anchor and bob if not pinned or fixed
        if(!this.anchor.pinned && !this.anchor.fixed) {
            this.anchor.position.subtract(offset);
        }
        if(!this.bob.pinned && !this.bob.fixed) {
            this.bob.position.add(offset);
        }
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
