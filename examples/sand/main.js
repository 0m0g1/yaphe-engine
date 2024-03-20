import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({element: "#yaphe-simulation"});
const sandWorld = engine.createWorld2d();
sandWorld.createCanvas();

const particles = 700;
const releaserX = sandWorld.canvas.width;
const units = releaserX / particles;

let x = sandWorld.canvas.width;
let direction = 1;

const interval = setInterval(() => {
   const sandGrain = sandWorld.createParticle2D(x, sandWorld.center.y - 300, true);
   sandGrain.radius = 5;
   // sandGrain.style.fillColor = "#C2B280";
   
   if (direction === 1) {
      x -= units * 2;
      if (x <= 0) {
         direction = -1;
      }
   } else {
      x += units * 2;
      if (x >= sandWorld.canvas.width) {
         clearInterval(interval);
      }
   }
}, 10);


engine.ignite(); // Corrected method name
