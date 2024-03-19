class Bounds2D {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(point) {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height
        );
    }
    intersects(otherBounds) {
        return !(
            this.x + this.width < otherBounds.x ||
            this.x > otherBounds.x + otherBounds.width ||
            this.y + this.height < otherBounds.y ||
            this.y > otherBounds.y + otherBounds.height
        );
    }
}

export default Bounds2D;