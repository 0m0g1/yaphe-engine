import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const boxWorld = engine.createWorld2d();
boxWorld.createCanvas();

const a = boxWorld.createParticle2D(boxWorld.center.x - 100, boxWorld.center.y - 100);
const b = boxWorld.createParticle2D(boxWorld.center.x + 100, boxWorld.center.y - 100);
const c = boxWorld.createParticle2D(boxWorld.center.x + 100, boxWorld.center.y + 100);
const d = boxWorld.createParticle2D(boxWorld.center.x - 100, boxWorld.center.y + 100);

const springa = boxWorld.createSpring2D(a, b);
const springb = boxWorld.createSpring2D(b, c);
const springc = boxWorld.createSpring2D(c, d);
const springd = boxWorld.createSpring2D(d, a);
const springe = boxWorld.createSpring2D(a, c);
const springf = boxWorld.createSpring2D(b, d);

springa.style.strokeColor = "red";
springe.style.visible = false;
springf.style.visible = false;

const particles = [a, b, c, d];
particles.forEach((particle) => {
    particle.style.visible = false;
    particle.radius = 1;
})

const springs = [springa, springb, springc, springd, springe, springf];
springs.forEach((spring) => {
    spring.damping = 0.5;
    spring.stiffness = 0.03;
})

engine.ignite();