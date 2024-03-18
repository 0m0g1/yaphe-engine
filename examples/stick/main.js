import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const stickWorld = engine.createWorld2d();
stickWorld.createCanvas();

const anchor = stickWorld.createParticle2D(stickWorld.center.x, stickWorld.center.y - 100);
const bob = stickWorld.createParticle2D(stickWorld.center.x, stickWorld.center.y + 100);
const stick = stickWorld.createStick2D(anchor, bob);

engine.ingite();
