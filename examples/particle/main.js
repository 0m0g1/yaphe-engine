import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const particleWorld = engine.createWorld2d();
particleWorld.createCanvas();
particleWorld.createParticle2D();
engine.ignite();