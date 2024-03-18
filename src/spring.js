import Vector2D from "./modules/2d/vector2d.js";

const canvas = document.querySelector("#canvas");
const pen = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const center = {
    x: canvas.width/2,
    y: canvas.height/2
}

class Spring2D {
    constructor(pen = null, anchor = new Vector2D(), bob = new Vector2D()) {
        this.pen = pen;
        this.anchor = anchor;
        this.bob = bob;
        this.velocity = new Vector2D();
        this.k = 0.01;
        this.restLength = 250;
    }
    update() {
        const force = this.bob.copy().subtract(this.anchor);
        const x = force.magnitude() - this.restLength;
        force.normalize();
        force.scalarMultiply(this.k * -1* x);
        this.velocity.add(force);
        
        this.bob.add(this.velocity);
        // this.velocity.scalarMultiply(-1);
        // this.anchor.add(this.velocity);
        this.velocity.scalarMultiply(0.99);
    }
    draw() {
        this.pen.beginPath();
        this.pen.moveTo(this.anchor.x, this.anchor.y);
        this.pen.lineTo(this.bob.x, this.bob.y);
        this.pen.stroke();
        
        this.pen.beginPath();
        this.pen.arc(this.anchor.x, this.anchor.y, 5, 0, 2  * Math.PI);
        this.pen.arc(this.bob.x, this.bob.y, 5, 0, 2  * Math.PI);
        this.pen.fill();
    }
}

const spring = new Spring2D(pen);
spring.anchor.x = center.x;
spring.anchor.y = center.y - 100;
spring.bob.x = center.x;
spring.bob.y = center.y + 100;

function update() {
    pen.clearRect(0, 0, canvas.width, canvas.height);
    spring.update();
    spring.draw();
    requestAnimationFrame(update);
}


update();