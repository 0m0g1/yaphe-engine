import Particle2D from "./particle2d.js";

class Stick2D {
    constructor(anchor = new Particle2D(), bob = new Particle2D()) {
        this.anchor = anchor;
        this.bob = bob;
        this.restLength = this.anchor.position.distanceTo(this.bob.position);
    }
    update() {
        const delta = this.bob.position.copy().subtract(this.anchor.position);
        const displacement = this.anchor.position.distanceTo(this.bob.position);
        const difference = this.restLength - displacement;
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

export default Stick2D;