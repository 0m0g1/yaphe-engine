import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({ element: "#yaphe-simulation" });
const clothWorld = engine.createWorld2d();
clothWorld.createCanvas();

const gridWidth = 6;
const gridHeight = 5;
const spacing = 20;


// Create particles in a grid
for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
        const xpos = clothWorld.center.x + (x - gridWidth / 2) * spacing;
        const ypos = clothWorld.center.y + (y - gridHeight / 2) * spacing;

        const particle = clothWorld.createParticle2D(xpos, ypos);
        particle.isPoint = true;

        if (y === 0 && (x === 0 || x === gridWidth - 1)) {
            particle.fixed = true; // Fix particles at the top corners
        }
    }
}

// Connect particles with springs horizontally
for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth - 1; x++) {
        const index = y * gridWidth + x;
        const anchor = clothWorld.objects.particles[index];
        const bob = clothWorld.objects.particles[index + 1];
        const spring = clothWorld.createSpring2D(anchor, bob);
        spring.stiffness = 0.005;
    }
}

// Connect particles with springs vertically
for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight - 1; y++) {
        const index = y * gridWidth + x;
        const anchor = clothWorld.objects.particles[index];
        const bob = clothWorld.objects.particles[index + gridWidth];
        const spring = clothWorld.createSpring2D(anchor, bob);
    }
}

engine.ignite();
