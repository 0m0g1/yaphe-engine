import utils from "../utils.js";
import Particle2D from "./particle2d.js";
import Spring2D from "./spring2d.js";
import Stick2D from "./stick2d.js";
import Vector2D from "./vector2d.js";

const boundaryBehavior = Object.freeze({
    wrapAround: "wrap Around",
    bounce: "bounce"
})

class World2d {
    constructor(constructors = {parent: null}) {
        this.parent = constructors.parent;
        this.canvas = null;
        this.pen = null;
        this.gravity = {
            state: true,
            acceleration: new Vector2D(0, 0.1)
        }
        this.objects = {
            sticks: [],
            springs: [],
            particles: [],
        }
        this.center = null;
        this.mouseEvents = {
            heldParticle: null,
            pathTraced: []
        }
        this.boundaryBehavior = boundaryBehavior.bounce;
    }
    createCanvas(width = this.parent.offsetWidth, height = this.parent.offsetHeight) {
        const canvas = document.createElement("canvas");
        this.parent.appendChild(canvas);

        this.canvas = canvas;
        this.pen = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        this.center = {
            x: canvas.width / 2,
            y: canvas.height / 2
        }

        canvas.onmousedown = (e) => {
            const mouseVector = new Vector2D(e.clientX, e.clientY);
            for (let i = 0; i < this.objects.particles.length; i++) {
                const particle = this.objects.particles[i];
                if (particle.position.distanceFrom(mouseVector) < particle.radius) {
                    this.mouseEvents.heldParticle = particle;
                    particle.isHeldByMouse = true;
                    canvas.style.cursor = "grab";
                    break;
                }
            }
        }
        canvas.onmousemove = (e) => {
            if (this.mouseEvents.heldParticle) {
                this.mouseEvents.heldParticle.position.x = e.clientX;
                this.mouseEvents.heldParticle.position.y = e.clientY;
                if (this.mouseEvents.pathTraced.length > 10) {
                    this.mouseEvents.pathTraced.shift();
                }
                this.mouseEvents.pathTraced.push(new Vector2D(e.clientX, e.clientY));
            }
        }
        canvas.onmouseup = (e) => {
            if (this.mouseEvents.heldParticle) {
                this.mouseEvents.heldParticle.isHeldByMouse = false;
                const averageVector = this.mouseEvents.pathTraced[0].getAverageVector(this.mouseEvents.pathTraced);
                this.mouseEvents.heldParticle.prevPosition.x = averageVector.x;
                this.mouseEvents.heldParticle.prevPosition.y = averageVector.y;
                this.mouseEvents.heldParticle = null;
                canvas.style.cursor = "auto";
            }
        }
    }
    resize(width = this.parent.style.width , height = this.parent.style.height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.center = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        }
    }
    createParticle2D(x = this.center.x, y = this.center.y) {
        const particle = new Particle2D(x, y);
        this.objects.particles.push(particle);
        return particle;
    }
    createSpring2D(a = new Particle2D(), b = new Particle2D()) {
        const spring = new Spring2D(a, b);
        this.objects.springs.push(spring);
        return spring;
    }
    createStick2D(a = new Particle2D(), b = new Particle2D()) {
        const stick = new Stick2D(a, b);
        this.objects.sticks.push(stick);
        return stick;
    }
    deflectParticle(particle) {
        if (particle.position.x > this.canvas.width - particle.radius) {
            particle.position.x = this.canvas.width - particle.radius
            particle.deflect("x");
        }
        if (particle.position.x < particle.radius) {
            particle.position.x = particle.radius
            particle.deflect("x");
        }
        if (particle.position.y > this.canvas.height - particle.radius) {
            particle.position.y = this.canvas.height - particle.radius;
            particle.deflect("y");
        }
        if (particle.position.y < particle.radius) {
            particle.position.y = particle.radius;
            particle.deflect("y");
        }
    }
    wrapParticle(particle) {
        if (particle.position.x > this.canvas.width - particle.radius) {
            particle.position.x = this.canvas.width - particle.radius
            particle.deflect("x");
        }
        if (particle.position.x < particle.radius) {
            particle.position.x = particle.radius
            particle.deflect("x");
        }
        if (particle.position.y > this.canvas.height - particle.radius) {
            particle.position.y = this.canvas.height - particle.radius;
            particle.deflect("y");
        }
        if (particle.position.y < particle.radius) {
            particle.position.y = particle.radius;
            particle.deflect("y");
        }
    }
    handleParticles() {
        this.objects.particles.forEach((particle) => {
            if (this.gravity.state) {
                particle.applyForce(this.gravity.acceleration);
            }
            if (this.boundaryBehavior == boundaryBehavior.bounce) {
                this.deflectParticle(particle);
            } else if (this.boundaryBehavior == boundaryBehavior.wrapAround) {
                this.wrapParticle(particle);
            }
            
            particle.detectCollision(this.objects.particles);

            if (!particle.fixed || !particle.isHeldByMouse) {
                particle.update();
            }

            particle.show(this.pen);
        })
    }
    update() {
        this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.handleParticles();
        this.objects.springs.forEach((spring) => {
            spring.update();
            spring.show(this.pen);
        })
        this.objects.sticks.forEach((stick) => {
            stick.update();
            stick.show(this.pen);
        })
    }
}


export default World2d;