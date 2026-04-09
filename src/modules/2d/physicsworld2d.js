// src/physics/PhysicsWorld2D.js
import Bounds2D from './bounds2d.js';
import Particle2D from './particle2d.js';
import Constraint2D from './constraint2d.js';
import Spring2D from './spring2d.js';
import Quadtree2D from './quadtree2d.js';
import Vector2D from './vector2d.js';

class PhysicsWorld2D {
  constructor(boundsWidth, boundsHeight, gravityY = 0.1, quadCapacity = 4) {
    this.bounds = new Bounds2D(0, 0, boundsWidth, boundsHeight);
    this.gravity = new Vector2D(0, gravityY);
    this.particles = [];
    this.constraints = [];
    this.springs = [];
    this.quadtree = new Quadtree2D(this.bounds, quadCapacity);
    this.squishParticlesThroughBoundary = false;
  }

  // ── Add objects ──────────────────────────────────────────────
  addParticle(x, y, radius = 5, fixed = false) {
    const p = new Particle2D(x, y);
    p.radius = radius;
    p.fixed = fixed;
    this.particles.push(p);
    this.quadtree.insert(p);
    return p;
  }

  addConstraint(p1, p2, width = 2, collidable = true) {
    const c = new Constraint2D(p1, p2);
    c.width = width;
    c.isCollidable = collidable;
    this.constraints.push(c);
    return c;
  }

  addSpring(p1, p2, stiffness = 0.01, maxLength = null) {
    const s = new Spring2D(p1, p2);
    s.stiffness = stiffness;
    if (maxLength !== null) s.maxLength = maxLength;
    this.springs.push(s);
    return s;
  }

  // ── Update loop (no rendering) ──────────────────────────────
  update() {
    this.quadtree.update();
    this._updateSprings();
    this._updateParticles();
    this._updateConstraints();
  }

  _updateSprings() {
    for (const s of this.springs) s.update();
  }

  _updateConstraints() {
    for (const c of this.constraints) c.update();
  }

  _updateParticles() {
    for (const p of this.particles) {
      if (!p.fixed && !p.isHeldByMouse) {
        p.applyForce(this.gravity);
        this._handleBoundary(p);
        // Collision detection with quadtree
        const range = new Bounds2D(
          p.position.x - p.radius * 2,
          p.position.y - p.radius * 2,
          p.radius * 4,
          p.radius * 4
        );
        const nearby = this.quadtree.queryRange(range);
        p.detectCollision(nearby);
        // Collision with constraint points
        for (const c of this.constraints) {
          if (c.isCollidable && p !== c.anchor && p !== c.bob) {
            p.detectCollision(c.getPoints());
          }
        }
        // Collision with spring points
        for (const s of this.springs) {
          if (s.isCollidable && p !== s.anchor && p !== s.bob) {
            p.detectCollision(s.getPoints());
          }
        }
        p.update();
        if (!this.squishParticlesThroughBoundary) this._handleBoundary(p);
      }
    }
  }

  _handleBoundary(p) {
    const r = p.isPoint ? 0 : p.radius;
    if (p.position.x - r < 0) {
      p.position.x = r;
      p.deflect('x');
    }
    if (p.position.x + r > this.bounds.width) {
      p.position.x = this.bounds.width - r;
      p.deflect('x');
    }
    if (p.position.y - r < 0) {
      p.position.y = r;
      p.deflect('y');
    }
    if (p.position.y + r > this.bounds.height) {
      p.position.y = this.bounds.height - r;
      p.deflect('y');
    }
  }
}


export default PhysicsWorld2D;