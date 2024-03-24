import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yahpe-simulation"});
const engineWorld = engine.createWorld2d();
engineWorld.createCanvas();

