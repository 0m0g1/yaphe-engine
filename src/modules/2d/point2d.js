import { Vector2D } from "./vector2d.js";

export class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    vector() {
        return new Vector2D(this.x, this.y);
    }
}
