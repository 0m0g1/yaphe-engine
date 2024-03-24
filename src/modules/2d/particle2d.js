import Vector2D from "./vector2d.js";

class Particle2D {
    constructor(x = 0, y = 0, randomInitialVelocity = false) {
        this.position = new Vector2D(x, y)
        this.prevPosition = this.position.copy();
        this.constrainedPosition = null;
        this.prevPosition.x -= randomInitialVelocity ? (Math.random() * (Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1))) : 0;
        this.prevPosition.y -= randomInitialVelocity ? (Math.random() * (Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1))) : 0;
        this.acceleration = new Vector2D();
        this.radius = 10;
        this.velocity = new Vector2D();
        this.damping = 0.99;
        this.isHeldByMouse = false;
        this.fixed = false;
        this.visible = true;
        this.isPoint = false;
        this.isConstrained = false;
        this.pinned = false;
        this.style = {
            stroke: false,
            strokeColor: "black",
            strokeWidth: 1,
            fill: true,
            fillColor: "black",
        }
        this.mass = 1;
    }
    applyForce(force){
        if (this.isHeldByMouse || this.fixed || this.pinned) return;
        this.acceleration.add(force.copy().scalarDivide(this.mass));
    }
    deflect(direction = "") {
        if (this.isHeldByMouse || this.fixed) return;
        
        const velocity = this.position.copy().subtract(this.prevPosition)
        
        if (direction.toLowerCase() === "x") {
            this.prevPosition.x = this.position.x + velocity.x;
        } else if (direction.toLowerCase() === "y") {
            this.prevPosition.y = this.position.y + velocity.y;
        } else {
            this.prevPosition.y = this.position.x + velocity.x;
            this.prevPosition.y = this.position.y + velocity.y;
        }
    }
    detectCollision(particles) {
        particles.forEach((particle) => {
            if (particle === this) return;
    
            const distanceVector = this.position.copy().subtract(particle.position);
            const distance = distanceVector.magnitude();
    
            if (distance === 0) return;
    
            const combinedRadius = this.isPoint ? particle.radius : this.radius + particle.radius;
    
            if (distance < combinedRadius) {
                // Calculate impulse magnitude for inelastic collision using damping
                const impulseMagnitude = distance - combinedRadius;
                const impulseVector = distanceVector.normalize().scalarMultiply(impulseMagnitude * particle.damping);
    
                // Apply impulse to adjust positions
                const inverseMassSum = 1 / (1 / this.mass + 1 / particle.mass);
                const displacementA = impulseVector.scalarMultiply(inverseMassSum);
                const displacementB = displacementA.scalarMultiply(-1);
    
                this.position.add(displacementA);
                particle.position.subtract(displacementB);
            }
        });
    }    
    update() {
        if (this.isHeldByMouse || this.fixed || this.pinned) return;
        
        const tempPos = this.position.copy();

        const velocity = this.position.copy().subtract(this.prevPosition);
        velocity.scalarMultiply(this.damping);

        this.position.add(velocity.add(this.acceleration));
        this.prevPosition = tempPos;
        this.acceleration = new Vector2D();

    }
    show(pen){
        if (!this.visible || this.isPoint) return;

        pen.beginPath();
        pen.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        
        pen.strokeStyle = this.style.strokeColor;
        pen.fillStyle = this.style.fillColor;

        if (this.style.fill) {
            pen.fill();
        }
        if (this.style.stroke) {
            pen.stroke();
        }
    }
}

export default Particle2D;
