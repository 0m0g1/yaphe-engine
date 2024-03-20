import Vector2D from "./vector2d.js";

class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    vector() {
        return new Vector2D(this.x, this.y);
    }
}

export default Point2D;