import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const springWorld = engine.createWorld2d();
springWorld.createCanvas();

const anchor = springWorld.createParticle2D(springWorld.center.x, springWorld.center.y - 100);
const bob = springWorld.createParticle2D(springWorld.center.x, springWorld.center.y + 100);
anchor.fixed = true;
const spring = springWorld.createSpring2D(anchor, bob);

engine.ingite();
