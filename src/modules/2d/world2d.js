import utils from "../utils.js";
import Bounds2D from "./bounds2d.js";
import Constraint2D from "./constraint2d.js";
import Engine2D from "./engine2d.js";
import Particle2D from "./particle2d.js";
import YaphePath2D from "./path2d.js";
import Quadtree2D from "./quadtree2d.js";
import Spring2D from "./spring2d.js";
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
            constraints: [],
            springs: [],
            particles: [],
            paths: [],
            engines: []
        }
        this.center = null;
        this.mouseEvents = {
            heldParticle: null,
            pathTraced: []
        }
        this.boundaryBehavior = boundaryBehavior.bounce;
        this.quadtree = null;
        this.quadSpaceMaxCapacity = 4;
        this.squishParticlesThroughBoundary = false;
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

        this.quadtree = new Quadtree2D(new Bounds2D(0, 0, canvas.width, canvas.height), this.quadSpaceMaxCapacity);
        canvas.onmousedown = (e) => {
            this.handleInputDown(e);
        }
        canvas.ontouchstart= (e) => {
            this.handleInputDown(e.touches[0]);
        }
        canvas.onmousemove = (e) => {
            this.handleInputMove(e);
        }
        canvas.ontouchmove = (e) => {
            this.handleInputMove(e.touches[0]);
        }
        canvas.onmouseup = (e) => {
            this.handleInputUp();
        }
        canvas.ontouchend = (e) => {
            this.handleInputUp();
        }
    }
    handleInputDown(e) {
        const mouseVector = new Vector2D(e.clientX, e.clientY);
            for (let i = 0; i < this.objects.particles.length; i++) {
                const particle = this.objects.particles[i];
                if (particle.pinned) return;
                let distanceToParticle = particle.position.distanceFrom(mouseVector);
                if (particle.radius > 4) {
                    if (distanceToParticle < particle.radius) {
                        this.mouseEvents.heldParticle = particle;
                        particle.isHeldByMouse = true;
                        this.canvas.style.cursor = "grab";
                        break;
                    }
                } else if (distanceToParticle < particle.radius + 4) {
                    this.mouseEvents.heldParticle = particle;
                    particle.isHeldByMouse = true;
                    this.canvas.style.cursor = "grab";
                    break;
                }
            }
    }
    handleInputMove(e) {
        if (this.mouseEvents.heldParticle) {
            this.mouseEvents.heldParticle.position.x = e.clientX;
            this.mouseEvents.heldParticle.position.y = e.clientY;
            if (this.mouseEvents.pathTraced.length > 10) {
                this.mouseEvents.pathTraced.shift();
            }
            this.mouseEvents.pathTraced.push(new Vector2D(e.clientX, e.clientY));
            this.handleSprings();
            this.handleConstrains();
        }
    }
    handleInputUp() {
        if (this.mouseEvents.heldParticle) {
            this.mouseEvents.heldParticle.isHeldByMouse = false;
            const averageVector = this.mouseEvents.pathTraced[0].getAverageVector(this.mouseEvents.pathTraced);
            this.mouseEvents.heldParticle.prevPosition.x = averageVector.x;
            this.mouseEvents.heldParticle.prevPosition.y = averageVector.y;
            this.mouseEvents.heldParticle = null;
            this.canvas.style.cursor = "auto";
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
    createParticle2D(x = this.center.x, y = this.center.y, randomInitialVelocity = false) {
        const particle = new Particle2D(x, y, randomInitialVelocity);
        this.objects.particles.push(particle);
        this.quadtree.insert(particle);
        return particle;
    }
    createSpring2D(a = new Particle2D(), b = new Particle2D()) {
        const spring = new Spring2D(a, b);
        this.objects.springs.push(spring);
        return spring;
    }
    createConstraint2D(a = new Particle2D(), b = new Particle2D()) {
        const constraint = new Constraint2D(a, b);
        this.objects.constraints.push(constraint);
        return constraint;
    }
    createPath2D() {
        const path = new YaphePath2D();
        this.objects.paths.push(path);
        return path;
    }
    createEngine2D(particles = [], path = new YaphePath2D()) {
        const engine = new Engine2D(particles, path);
        this.objects.engines.push(engine);
        return engine;
    }
    deflectParticle(particle) {
        if (particle.isPoint) {
            if (particle.position.x > this.canvas.width) {
                particle.position.x = this.canvas.width
                particle.deflect("x");
            }
            if (particle.position.x < particle.radius) {
                particle.position.x = particle.radius
                particle.deflect("x");
            }
            if (particle.position.y > this.canvas.height) {
                particle.position.y = this.canvas.height;
                particle.deflect("y");
            }
            if (particle.position.y < 0) {
                particle.position.y = 0;
                particle.deflect("y");
            }
        } else {
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
    handleOutOfBoundary(particle) {
        if (this.boundaryBehavior == boundaryBehavior.bounce) {
            this.deflectParticle(particle);
        } else if (this.boundaryBehavior == boundaryBehavior.wrapAround) {
            this.wrapParticle(particle);
        }
    }
    handleParticles() {
        this.objects.particles.forEach((particle) => {
            if (this.gravity.state) {
                particle.applyForce(this.gravity.acceleration);
            }

            this.handleOutOfBoundary(particle);
            
            const squareWidth = 4 * particle.radius;
            const squareHeight = 4 * particle.radius;

            const collisionRange = new Bounds2D(
                particle.position.x - squareWidth / 2,
                particle.position.y - squareHeight / 2,
                squareWidth,
                squareHeight
            )

            const nearbyParticles = this.quadtree.queryRange(collisionRange);

            particle.detectCollision(nearbyParticles);
            this.objects.constraints.forEach((constraint) => {
                if (particle !== constraint.anchor && particle !== constraint.bob){
                    particle.detectCollision(constraint.getPoints());
                }
            })
            this.objects.springs.forEach((spring) => {
                if (particle !== spring.anchor && particle !== spring.bob) {
                    particle.detectCollision(spring.getPoints());
                }
            })

            if (!particle.fixed || !particle.isHeldByMouse) {
                particle.update();
            }

            if (!this.squishParticlesThroughBoundary) {
                this.handleOutOfBoundary(particle);
            }
        })
    }
    handleSprings() {
        this.objects.springs.forEach((spring) => {
            spring.update();
        })
    }
    handleConstrains() {
        this.objects.constraints.forEach((constraint) => {
            constraint.update();
        })
    }
    handleEngines() {
        this.objects.engines.forEach((engine) => {
            engine.update();
        })
    }
    render() {
        this.pen.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.objects.particles.forEach((particle) => {
            particle.show(this.pen);
        })
        this.objects.springs.forEach((spring) => {
            spring.show(this.pen);
        })
        this.objects.constraints.forEach((constraint) => {
            constraint.show(this.pen);
        })
        this.objects.engines.forEach((engine) => {
            engine.show(this.pen);
        })
    }
    update() {
        this.quadtree.update();
        this.handleSprings();
        this.handleParticles();
        this.handleConstrains();
        this.handleEngines();
        this.render();
    }
}


export default World2d;
