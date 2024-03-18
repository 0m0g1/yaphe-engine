import utils from "../utils.js";
import Particle2D from "./particle2d.js";
import Vector2D from "./vector2d.js";

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
            springs: [],
            particles: []
        }
        this.center = null;
        this.mouseEvents = {
            heldParticle: null,
            pathTraced: []
        }
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
    handleParticles() {
        this.objects.particles.forEach((particle) => {
            if (this.gravity.state) {
                particle.applyForce(this.gravity.acceleration);
            }
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
            particle.update();
            particle.draw(this.pen);
        })
    }
    update() {
        this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.handleParticles();
        this.objects.springs.forEach((spring) => {
            spring.update();
            spring.draw(this.pen);
        })
    }
}


export default World2d;