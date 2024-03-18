import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const particleWorld = engine.createWorld2d();
particleWorld.createCanvas();

document.onmousedown = (e) => {
    const particle = particleWorld.createParticle2D(e.clientX, e.clientY);
    // particle.damping = 0.95;
}

engine.ingite();