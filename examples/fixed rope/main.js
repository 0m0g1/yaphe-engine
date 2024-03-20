import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const ropeWorld = engine.createWorld2d();
ropeWorld.createCanvas();

const y = ropeWorld.center.y - 200;
const particles = [];

for (let i = 0; i < 10; i++) {
    const particle = ropeWorld.createParticle2D(undefined, y, false);
    particle.radius = 4;
    particles.push(particle);
}

particles[0].fixed = true;

for (let i = 0; i < particles.length - 1; i++) {
    const spring = ropeWorld.createSpring2D(particles[i], particles[i + 1]);
}


engine.ignite();