/**
 * Vector2D — allocation-optimized rewrite
 *
 * Bugs fixed vs previous version
 * ────────────────────────────────
 * 1. distanceTo / distanceFrom  — called this.copy() / point.copy() then
 *    subtract(), allocating a temporary Vector2D just to compute a scalar.
 *    Fixed: inline the arithmetic, zero allocations.
 *
 * 2. normaliz() (the typo'd duplicate of normalize()) — returned
 *    `new Vector2D(this.x/mag, this.y/mag, this.z/mag)` AFTER already
 *    mutating this.x and this.y in place, so it divided by magnitude twice
 *    AND leaked this.z (undefined → NaN). Dead code, but a silent bug.
 *    Fixed: removed; normalize() is the correct in-place version.
 *
 * 3. lerp() — always returned a new Vector2D. Fine for occasional use but
 *    called inside animation loops it's a per-frame allocation.
 *    Fixed: lerpInto(out, t) writes into a caller-supplied vector.
 *    Original lerp() kept for API compatibility (still allocates, but now
 *    callers have the choice).
 *
 * 4. getAverageVector() — called this.copy() allocating a new vector, then
 *    did N divisions inside forEach (allocating a closure each iteration).
 *    The running-average formula (divide by 2 each step) is also
 *    mathematically wrong for N > 2 vectors — it weights earlier vectors
 *    exponentially less than later ones.
 *    Fixed: correct sum / N formula, no copy(), no forEach closure.
 *
 * 5. Static scratch pool — four reusable Vector2D instances for
 *    call-sites that need a temporary but don't want to allocate.
 *    Usage:  const tmp = Vector2D.tmp(0);  tmp.x = ...; tmp.y = ...;
 *    Never hold a reference to a scratch vector across an await or
 *    across any call that might also use scratches.
 */

export class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // ── Mutating arithmetic ──────────────────────────────────────────────────

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    scalarMultiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    scalarDivide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    setFrom(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    // ── Scalar queries ───────────────────────────────────────────────────────

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitudeSq() {
        return this.x * this.x + this.y * this.y;
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    // FIX 1a: distanceTo — was: point.copy().subtract(this) → 1 alloc
    // Now: pure arithmetic, 0 allocs
    distanceTo(point) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // FIX 1b: distanceFrom — was: this.copy().subtract(point) → 1 alloc
    distanceFrom(point) {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    distanceSqTo(point) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        return dx * dx + dy * dy;
    }

    angleTo(point) {
        return Math.atan2(point.y - this.y, point.x - this.x);
    }

    angleFrom(point) {
        return Math.atan2(this.y - point.y, this.x - point.x);
    }

    // ── In-place transforms ───────────────────────────────────────────────────

    normalize() {
        const mag = Math.sqrt(this.x * this.x + this.y * this.y);
        if (mag > 0) {
            this.x /= mag;
            this.y /= mag;
        }
        return this;
    }

    // ── Allocating helpers (use sparingly in hot paths) ───────────────────────

    copy() {
        return new Vector2D(this.x, this.y);
    }

    clone() {
        return new Vector2D(this.x, this.y);
    }

    // lerp — kept for API compatibility; allocates a new vector.
    // Prefer lerpInto() in hot paths.
    lerp(other, t) {
        return new Vector2D(
            this.x + (other.x - this.x) * t,
            this.y + (other.y - this.y) * t,
        );
    }

    // FIX 3: lerpInto — writes result into `out` (no allocation)
    // Example: Vector2D.tmp(0).setFrom(a); a.lerpInto(b, 0.5, tmp);
    lerpInto(other, t, out) {
        out.x = this.x + (other.x - this.x) * t;
        out.y = this.y + (other.y - this.y) * t;
        return out;
    }

    // FIX 4: getAverageVector — was: this.copy() + forEach closure + wrong math
    //
    // The old formula divided by 2 at every step:
    //   step 0: total = this
    //   step 1: total = (this + v1) / 2          ← correct for 2 items
    //   step 2: total = ((this + v1)/2 + v2) / 2 ← WRONG, weights v2 more
    //
    // A 3-vector average of [1, 1, 100] would give:
    //   old: ((1+1)/2 + 100)/2 = 51  (not 34 = (1+1+100)/3)
    //
    // Fixed: sum everything, divide by count once.
    // Also no longer calls this.copy() — writes into a new vector directly.
    getAverageVector(vectors) {
        let sx = this.x, sy = this.y;
        let count = 1;
        if (Array.isArray(vectors)) {
            for (let i = 0; i < vectors.length; i++) {
                sx += vectors[i].x;
                sy += vectors[i].y;
                count++;
            }
        } else {
            sx += vectors.x;
            sy += vectors.y;
            count = 2;
        }
        return new Vector2D(sx / count, sy / count);
    }

    // ── Static scratch pool ───────────────────────────────────────────────────
    //
    // Four pre-allocated reusable vectors. Use in synchronous hot paths to
    // avoid allocation. Rules:
    //   • Never store a reference to a scratch beyond the current function.
    //   • Never use the same index twice in the same expression.
    //   • Never use across an `await`.
    //
    // Example (in Particle2D.update):
    //   const vel = Vector2D.tmp(0);
    //   vel.x = this.position.x - this.prevPosition.x;
    //   vel.y = this.position.y - this.prevPosition.y;

    static tmp(index) {
        return Vector2D._scratch[index];
    }
}

// Initialise the scratch pool after the class is defined
Vector2D._scratch = [
    new Vector2D(),
    new Vector2D(),
    new Vector2D(),
    new Vector2D(),
];
