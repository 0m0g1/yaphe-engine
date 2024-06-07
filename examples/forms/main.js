import YapheEngine from "../../src/engine.js";

const engine = new YapheEngine({"element": "#yaphe-simulation"});
const formWorld = engine.createWorld2d();
formWorld.createCanvas();

function createFirstForm() {
    const a = formWorld.createParticle2D(formWorld.center.x - 200, formWorld.center.y - 20);
    const b = formWorld.createParticle2D(formWorld.center.x - 160, formWorld.center.y - 20);
    const c = formWorld.createParticle2D(formWorld.center.x - 120, formWorld.center.y - 20);
    const d = formWorld.createParticle2D(formWorld.center.x - 80, formWorld.center.y - 20);
    const e = formWorld.createParticle2D(formWorld.center.x - 40, formWorld.center.y - 20);
    const f = formWorld.createParticle2D(formWorld.center.x, formWorld.center.y - 20);
    const a2 = formWorld.createParticle2D(formWorld.center.x - 200, formWorld.center.y + 20);
    const b2 = formWorld.createParticle2D(formWorld.center.x - 160, formWorld.center.y + 20);
    const c2 = formWorld.createParticle2D(formWorld.center.x - 120, formWorld.center.y + 20);
    const d2 = formWorld.createParticle2D(formWorld.center.x - 80, formWorld.center.y + 20);
    const e2 = formWorld.createParticle2D(formWorld.center.x - 40, formWorld.center.y + 20);
    const f2 = formWorld.createParticle2D(formWorld.center.x, formWorld.center.y + 20);

    const particles = [a, b, c, d, e, f, f2, e2, d2, c2, b2, a2];
    particles.forEach((particle) => {
        particle.isPoint = true;
    })
    for (let i = 0; i < particles.length; i++) {
        if (i == particles.length - 1) {
            const spring = formWorld.createConstraint2D(particles[i], particles[0]);
        } else {
            const spring = formWorld.createConstraint2D(particles[i], particles[i + 1]);
        }
    }
    
    for (let i = 0; i < 5; i++) {
        const constraint = formWorld.createConstraint2D(particles[i], particles[particles.length - i - 1]);
        constraint.isCollidable = false;
    }
    for (let i = 0; i < 5; i++) {
        const constraint = formWorld.createConstraint2D(particles[i], particles[particles.length - i - 2]);
        constraint.isCollidable = false;
        constraint.visible = false;
    }
    for (let i = 5; i > 0; i--) {
        const constraint = formWorld.createConstraint2D(particles[i], particles[particles.length - i]);
        constraint.isCollidable = false;
        constraint.visible = false;
    }

    // formWorld.createConstraint2D(a, f2);
    // formWorld.createConstraint2D(f, a2);
    
    const form = formWorld.createForm2D(particles);
}

function createSecondForm() {
    const godotObject = {
        particle: formWorld.createParticle2D(),
        form: formWorld.createForm2D()
    }
    godotObject.particle.radius = 50;
    godotObject.form.centered = true;
    godotObject.form.createCanvasImage({src: "./icon.svg", parent: godotObject.particle});
}

function createThirdForm() {
    const godotObject = {
        rect: [
            formWorld.createParticle2D(formWorld.center.x - 100, formWorld.center.y - 100),
            formWorld.createParticle2D(formWorld.center.x + 100, formWorld.center.y - 100),
            formWorld.createParticle2D(formWorld.center.x + 100, formWorld.center.y + 100),
            formWorld.createParticle2D(formWorld.center.x - 100, formWorld.center.y + 100),
        ],
        form: formWorld.createForm2D()
    }
    godotObject.rect.forEach((particle) => {
        particle.isPoint = true;
    })
    formWorld.createConstraint2D(godotObject.rect[0], godotObject.rect[1]);
    formWorld.createConstraint2D(godotObject.rect[1], godotObject.rect[2]);
    formWorld.createConstraint2D(godotObject.rect[2], godotObject.rect[3]);
    formWorld.createConstraint2D(godotObject.rect[3], godotObject.rect[0]);
    const a  = formWorld.createConstraint2D(godotObject.rect[0], godotObject.rect[2]);
    const b  = formWorld.createConstraint2D(godotObject.rect[1], godotObject.rect[3]);
    a.visible = false;
    b.visible = false;
    godotObject.form.createCanvasImage({src: "./icon.svg", rect: godotObject.rect});
}

createFirstForm();
createSecondForm();
createThirdForm();
engine.start();