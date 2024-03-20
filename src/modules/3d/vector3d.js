class Vector3D {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
        return this;   
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        return this;
    }
    scalarMultiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }
    scalarDivide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
        return this;
    }
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }
    normalize() {
        const magnitude = this.magnitude();
        this.x /= magnitude;
        this.y /= magnitude;
        this.z /= magnitude;
        return this;
    }
    normal() {
        const magnitude = this.magnitude();
        return new Vector3D(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }
    distanceTo(point) {
        const delta = point.copy().subtract(this);
        return Math.sqrt(delta.x ** 2 + delta.y ** 2 + delta.z ** 2);
    }
    distanceFrom(point) {
        const delta = this.copy().subtract(point);
        return Math.sqrt(delta.x ** 2 + delta.y ** 2 + delta.z ** 2);
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
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }
    copy() {
        return new Vector3D(this.x, this.y, this.z);
    }
}

export default Vector3D;