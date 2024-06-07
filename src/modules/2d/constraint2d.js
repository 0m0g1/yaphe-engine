import Particle2D from "./particle2d.js";
import Style2D from "./style2d.js";

class Constraint2D {
    constructor(anchor = new Particle2D(), bob = new Particle2D()) {
        this.anchor = anchor;
        this.bob = bob;
        this.restLength = this.anchor.position.distanceTo(this.bob.position);
        this.width = 1;
        this.visible = true;
        this.style = new Style2D();
        this.isCollidable = true;
    }
    getPoints() {
        const points = [];
        const numOfPoints = this.restLength / (this.width / 2);
        for (let i = 0; i <= numOfPoints; i++) {
            const t = i / numOfPoints;
            const interpolatedPoint = this.anchor.position.copy().lerp(this.bob.position, t);
            const particle = new Particle2D(interpolatedPoint.x, interpolatedPoint.y);
            if (this.anchor.isPoint || this.bob.isPoint) {
                particle.isPoint = true;
            } else {
                particle.radius = this.width / 2;
            }
            particle.isCollidable = this.isCollidable;
            points.push(particle);
        }
        return points;
    }
    update() {
        // this.anchor.isConstrained = false;
        // this.bob.isConstrained = false;

        const delta = this.bob.position.copy().subtract(this.anchor.position);
        const displacement = this.anchor.position.distanceTo(this.bob.position);
        const difference = this.restLength - displacement;
        const percentage = (difference / displacement) / 2;

        const offset = delta.scalarMultiply(percentage);

        if (difference === 0) return;

        // if (this.anchor.isHeldByMouse && this.bob.fixed) {
        //     this.anchor.position.subtract(offset);
        //     this.anchor.isConstrained = true;
        // } else if (this.bob.isHeldByMouse && this.anchor.fixed) {
        //     this.bob.position.add(offset);
        //     this.bob.isConstrained = true;
        // } else {
        //     this.anchor.position.subtract(offset);
        //     this.bob.position.add(offset);
        //     this.anchor.isConstrained = true;
        //     this.bob.isConstrained = true;
        // }
    
        if (!this.anchor.isHeldByMouse && !this.anchor.fixed && difference) {
            this.anchor.position.subtract(offset);
        }
        if (!this.bob.isHeldByMouse && !this.bob.fixed) {
            this.bob.position.add(offset);
        }
    }
    show(pen) {
        if (!this.style.visible || !this.visible) return;

        pen.beginPath();
        pen.lineWidth = this.style.lineWidth;
        pen.strokeStyle = this.style.strokeColor;
        pen.moveTo(this.anchor.position.x, this.anchor.position.y);
        pen.lineTo(this.bob.position.x, this.bob.position.y);
        pen.stroke();
    }
}

export default Constraint2D;
