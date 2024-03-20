import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const stickWorld = engine.createWorld2d();
stickWorld.createCanvas();

stickWorld.createParticle2D();

const anchor = stickWorld.createParticle2D(stickWorld.center.x, stickWorld.center.y - 100);
const bob = stickWorld.createParticle2D(stickWorld.center.x, stickWorld.center.y + 100);
anchor.radius = 2;
bob.radius = 2;

const stick = stickWorld.createConstraint2D(anchor, bob);
stick.style.lineWidth = 4;

engine.ignite();
