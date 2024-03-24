import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const engineWorld = engine.createWorld2d();
engineWorld.createCanvas();

const a = engineWorld.createParticle2D(engineWorld.center.x, engineWorld.center.y - 100);
const b = engineWorld.createParticle2D(engineWorld.center.x, engineWorld.center.y - 50);
const c = engineWorld.createParticle2D(engineWorld.center.x, engineWorld.center.y);
const d = engineWorld.createParticle2D(engineWorld.center.x, engineWorld.center.y + 50);
engineWorld.createConstraint2D(a, b);
engineWorld.createConstraint2D(b, c);
engineWorld.createConstraint2D(c, d);

const e = engineWorld.createParticle2D(engineWorld.center.x + 50, engineWorld.center.y + 50);
const f = engineWorld.createParticle2D(engineWorld.center.x + 50, engineWorld.center.y + 100);
const g = engineWorld.createParticle2D(engineWorld.center.x, engineWorld.center.y + 100);

const particles = [a, b, c, d, e, f , g];
particles.forEach((particle) => {
    particle.isPoint = true;
})


engineWorld.createConstraint2D(d, e);
engineWorld.createConstraint2D(e, f);
engineWorld.createConstraint2D(f, g);
engineWorld.createConstraint2D(g, d);
engineWorld.createConstraint2D(d, f).style.visible = false;
engineWorld.createConstraint2D(e, g).style.visible = false;


const enginePath = engineWorld.createPath2D();

const polarEquation = (angle) => {
    const x =  100 * Math.cos(angle) + engineWorld.center.x;
    const y =  100 * Math.sin(angle) + engineWorld.center.y - 150;
    return {x, y};
}

enginePath.setEquation(polarEquation);
enginePath.generatePointsFromEquation(0, 360, 0.1);

const engineMortar = engineWorld.createEngine2D([a], enginePath);
engineMortar.angle = 0;
engineMortar.speed = 0.01;

const updateFunction = (engine) => {
    engine.angle += engine.speed;
    // Ensure angle stays within [0, 2π)
    engine.angle %= Math.PI * 2;
    return engine.path.getPointAt(engine.angle);
}

engineMortar.setUpdateFunction(updateFunction);

engine.ignite();