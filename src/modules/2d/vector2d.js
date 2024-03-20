class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
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
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize() {
        const magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }
    normaliz() {
        const magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        return new Vector2D(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }
    distanceTo(point) {
        const delta = point.copy().subtract(this);
        return Math.sqrt(delta.x ** 2 + delta.y ** 2);
    }
    distanceFrom(point) {
        const delta = this.copy().subtract(point);
        return Math.sqrt(delta.x ** 2 + delta.y ** 2);
    }
    getAverageVector(vectors) {
        let totalVector = this.copy();
        if (Array.isArray(vectors)) {
            vectors.forEach((vector) => {
                totalVector.add(vector);
                totalVector.scalarDivide(2);
            })
        } else {
            totalVector.add(vectors);
            totalVector.scalarDivide(2);
        }
        return totalVector;
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    lerp(otherVector, t) {
        return new Vector2D(
            this.x + (otherVector.x - this.x) * t,
            this.y + (otherVector.y - this.y) * t
        );
    }
    clone() {
        this.copy();
    }
    copy() {
        return new Vector2D(this.x, this.y);
    }
}

export default Vector2D;