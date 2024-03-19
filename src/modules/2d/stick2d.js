import Particle2D from "./particle2d.js";

class Stick2D {
    constructor(anchor = new Particle2D(), bob = new Particle2D()) {
        this.anchor = anchor;
        this.bob = bob;
        this.restLength = this.anchor.position.distanceTo(this.bob.position);
        this.style = {
            visible: true,
            lineWidth: 1,
        }
    }
    update() {
        const delta = this.bob.position.copy().subtract(this.anchor.position);
        const displacement = this.anchor.position.distanceTo(this.bob.position);
        const difference = this.restLength - displacement;
        const percentage = (difference / displacement) / 2;

        const offset = delta.scalarMultiply(percentage);

        if ((!this.anchor.isHeldByMouse && !this.anchor.fixed) || difference !== 0) {
            this.anchor.position.subtract(offset);
        }
        if ((!this.bob.isHeldByMouse && !this.bob.fixed) || difference !== 0) {
            this.bob.position.add(offset);
        }
    }
    show(pen) {
        if (!this.style.visible) return;

        pen.beginPath();
        pen.lineWidth = this.style.lineWidth;
        pen.moveTo(this.anchor.position.x, this.anchor.position.y);
        pen.lineTo(this.bob.position.x, this.bob.position.y);
        pen.stroke();
    }
}

export default Stick2D;