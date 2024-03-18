import World2d from "./modules/2d/world2d.js";

class YapheEngine {
    constructor(constructors = {element: null}) {
        this.parentElement = document.querySelector(constructors.element);
        this.world2Ds = [];
        if (!this.parentElement) {
            console.error(`Element ${constructors.element} does not exist`);
        }
        this.start = this.start.bind(this);
    }
    createWorld2d() {
        const world2d = new World2d({parent: this.parentElement});
        this.world2Ds.push(world2d);
        return world2d;
    }
    ingite() {
        this.start();
    }
    start() {
        this.world2Ds.forEach((world) => {
            world.update();
        })
        requestAnimationFrame(this.start);
    }
}

export default YapheEngine;