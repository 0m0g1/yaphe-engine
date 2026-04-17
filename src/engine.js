// src/engine.js
// ───────────────────────────────────────────────────────────────────────────
// Yaphe Engine – Public Facade
// Import only from here – never from internal modules directly.
//
// Exports:
//   World2d, PhysicsWorld2D, Particle2D, Vector2D, Quadtree2D,
//   Constraint2D, Spring2D, Form2D, Path2D, Point2D, Bounds2D,
//   Engine2D, Renderer2D, Style2D, Vector3D, Utils,
//   YapheEngine (default and named)
// ───────────────────────────────────────────────────────────────────────────

// 2D Core
export { World2d }        from './modules/2d/world2d.js';
export { PhysicsWorld2D } from './modules/2d/physicsworld2d.js';
export { Particle2D }     from './modules/2d/particle2d.js';
export { Vector2D }       from './modules/2d/vector2d.js';
export { Quadtree2D }     from './modules/2d/quadtree2d.js';
export { Constraint2D }   from './modules/2d/constraint2d.js';
export { Spring2D }       from './modules/2d/spring2d.js';
export { Form2D }         from './modules/2d/form2d.js';
export { Path2D }         from './modules/2d/path2d.js';
export { Point2D }        from './modules/2d/point2d.js';
export { Bounds2D }       from './modules/2d/bounds2d.js';
export { Engine2D }       from './modules/2d/engine2d.js';
export { Renderer2D }     from './modules/2d/renderer2d.js';
export { Style2D }        from './modules/2d/style2d.js';

// 3D Module
export { Vector3D }       from './modules/3d/vector3d.js';

// Utilities
export * as Utils                    from './modules/utils.js';

// Main YapheEngine class (default + named)
export { default } from './engine.js';   // careful: circular? Better to define class here.
// Actually we need to define the class in this file, not re-export from itself.
// Let's import it from its own file if it's separate, but originally the class was in this file.
// We'll move the class definition below and export it.

// ===========================================================================
// Main YapheEngine class (was originally in this file)
// ===========================================================================
import World2d from './modules/2d/world2d.js';

class YapheEngine {
    constructor(constructors = { element: null }) {
        this.parentElement = document.querySelector(constructors.element);
        this.world2Ds = [];
        if (!this.parentElement) {
            console.error(`Element ${constructors.element} does not exist`);
        }
        this.start = this.start.bind(this);
    }

    createWorld2d() {
        return this.createWorld2D();
    }

    createWorld2D() {
        const world2d = new World2d({ parent: this.parentElement });
        this.world2Ds.push(world2d);
        return world2d;
    }

    ignite() {
        this.start();
    }

    start() {
        this.world2Ds.forEach((world) => {
            world.update();
        });
        requestAnimationFrame(this.start);
    }
}

// Named export of YapheEngine (so you can import { YapheEngine } from 'yaphe-engine')
export { YapheEngine };

// Default export remains YapheEngine (for backward compatibility)
export default YapheEngine;

// Optional: attach to window for non‑module usage
if (typeof window !== 'undefined') {
    window.YapheEngine = YapheEngine;
}