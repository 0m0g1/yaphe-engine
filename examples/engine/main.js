import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const engineWorld = engine.createWorld2d();
engineWorld.createCanvas();

const a = engineWorld.createParticle2D(engineWorld.center.x, engineWorld.center.y - 100);
const b = engineWorld.createParticle2D(engineWorld.center.x, engineWorld.center.y + 100);
engineWorld.createConstraint2D(a, b);


const enginePath = engineWorld.createPath2D();

const polarEquation = (angle) => {
    const x =  100 * Math.cos(angle) + engineWorld.center.x;
    const y =  100 * Math.sin(angle) + engineWorld.center.y - 100;
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

engineMortar.position.x = engineWorld.center.x;
engineMortar.position.y = engineWorld.center.y;

engineMortar.setUpdateFunction(updateFunction);

engine.ignite();