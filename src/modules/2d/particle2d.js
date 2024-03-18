import Vector2D from "./vector2d.js";

class Particle2D {
    constructor(x = 0, y = 0) {
        this.position = new Vector2D(x, y)
        this.prevPosition = this.position.copy();
        this.prevPosition.x -= Math.random() * (Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1));
        this.prevPosition.y -= Math.random() * (Math.random() * 10 * (Math.random() < 0.5 ? 1 : -1));
        this.acceleration = new Vector2D();
        this.radius = 10;
        this.velocity = new Vector2D();
        this.damping = 0.99;
        this.isHeldByMouse = false;
        this.fixed = false;
        this.style = {
            stroke: false,
            strokeColor: "black",
            strokeWidth: 1,
            fill: true,
            fillColor: "black",
        }
    }
    applyForce(force){
        if (this.isHeldByMouse || this.fixed) return;
        this.acceleration.add(force);
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

            const distanceToParticle = this.position.distanceTo(particle.position);

            if (distanceToParticle < this.radius + particle.radius) {
                // Calculate displacement vector from this particle to the other particle
                const displacement = particle.position.copy().subtract(this.position);
                displacement.normalize();
                
                // Compute deflection displacements
                const combinedDamping = Math.sqrt(this.damping * particle.damping);
                const deflectionMagnitude = (this.radius + particle.radius - distanceToParticle) / 2; // Adjust the deflection magnitude as needed
                const deflectionDisplacement = displacement.copy().scalarMultiply(deflectionMagnitude);

                // Update particle positions to simulate deflection
                if (!this.isHeldByMouse && !this.fixed){
                    this.position.add(deflectionDisplacement);
                }
                if (!particle.isHeldByMouse && !particle.fixed){
                    particle.position.subtract(deflectionDisplacement);
                }
            }
        })
    }
    update() {
        if (this.isHeldByMouse || this.fixed) return;
        
        const tempPos = this.position.copy();

        const velocity = this.position.copy().subtract(this.prevPosition);
        velocity.scalarMultiply(this.damping);

        this.position.add(velocity.add(this.acceleration));
        this.prevPosition = tempPos;
        this.acceleration = new Vector2D();

    }
    show(pen){
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