import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({ element: "#yaphe-simulation" });
const netWorld = engine.createWorld2d();
netWorld.createCanvas();

const gridWidth = 6;
const gridHeight = 5;
const spacing = 20;


// Create particles in a grid
for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
        const xpos = netWorld.center.x + (x - gridWidth / 2) * spacing;
        const ypos = netWorld.center.y + (y - gridHeight / 2) * spacing;

        const particle = netWorld.createParticle2D(xpos, ypos);
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
        const anchor = netWorld.objects.particles[index];
        const bob = netWorld.objects.particles[index + 1];
        const spring = netWorld.createSpring2D(anchor, bob);
        spring.stiffness = 0.005;
    }
}

// Connect particles with springs vertically
for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight - 1; y++) {
        const index = y * gridWidth + x;
        const anchor = netWorld.objects.particles[index];
        const bob = netWorld.objects.particles[index + gridWidth];
        const spring = netWorld.createSpring2D(anchor, bob);
    }
}

netWorld.createParticle2D(undefined, netWorld.center.y - 100, undefined);

engine.ignite();
