import Particle2D from "./particle2d.js";
import Style2D from "./style2d.js";

class Form2D {
    constructor(particles = []) {
        this.path = particles;
        this.style = new Style2D();
        this.parent = null;
        this.boundingRect = {
            topRight: null,
            topLeft: null,
            bottomRight: null,
            bottomLeft: null,
        }
        this.image = {
            topRight: null,
            topLeft: null,
            bottomRight: null,
            bottomLeft: null,
            canvasObject: null,
            src: null,
            centered: true,
        }
        if (this.path.length !== 0 && this.path[0] instanceof Particle2D == false) {
            throw(`Form 2D paths should be an array of particles not and array of ${this.path[0]}`);
        }
    }
    createCanvasImage({src, parent, rect}) {
        const img = new Image();
        img.onload = () => {
            this.image.src = src;
            this.image.canvasObject = img;
        }
        img.src = src;
        if (parent) {
            this.image.centered = true;
            this.parent = parent;
        } else if (rect) {
            this.image.topLeft = rect[0];
            this.image.topRight = rect[1];
            this.image.bottomRight = rect[2];
            this.image.bottomLeft = rect[3];
        }
    }
    show(pen) {
        this.render(pen);
    }
    render(pen) {
        if (!this.image.src && this.path.length !== 0) {
            pen.beginPath();
            pen.moveTo(this.path[0].position.x, this.path[0].position.y);
            this.path.forEach((point) => {
                pen.lineTo(point.position.x, point.position.y)
            })
            pen.moveTo(this.path[0].position.x, this.path[0].position.y);
            pen.fill();
        } else {
            if (this.image.canvasObject == null) return;
            if (this.parent) {
                pen.drawImage(
                    this.image.canvasObject,
                    this.parent.position.x - this.parent.radius,
                    this.parent.position.y - this.parent.radius,
                    this.parent.radius * 2 ,
                    this.parent.radius * 2
                );
            } else {
                pen.save();

                const angle = this.image.topLeft.position.angleTo(this.image.topRight.position);
                pen.translate(this.image.topLeft.position.x, this.image.topLeft.position.y);
                pen.rotate(angle);
                
                pen.drawImage(
                    this.image.canvasObject,
                    0,
                    0,
                    this.image.topLeft.position.distanceTo(this.image.topRight.position),
                    this.image.topLeft.position.distanceTo(this.image.bottomLeft.position),
                )

                pen.translate(-this.image.topLeft.position.x, -this.image.topRight.position.y);


                pen.restore();
            }
        }
    }
}

export default Form2D;