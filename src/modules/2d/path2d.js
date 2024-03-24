import Vector2D from "./vector2d";

class YaphePath2D {
    constructor() {
        this.points = [];
        this.equation = null;
        this.speed = 0.01;
    }
    addPoint(x, y) {
        const point = new Vector2D(x, y);
        this.points.push(point);
    }
    generatePointsFromEquation(equationFunction, startX, endX, step) {
        this.equation = equationFunction;
        if (this.equation) {
            for (let x = startX; x < endX; x += step) {
                const y = this.equation(x);
                this.addPoint(x, y);
            }
        } else {
            console.error(`Equation is not set. Please set an equation for your function`);
        }
    }
    getPointAt(x) {
        const y = this.equation(x);
        return {x, y};
    }
    getPoints() {
        return this.points;
    }
    show(pen) {
        pen.beginPath();
        pen.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach((point, index) => {
            point.lineTo(point[index].x, point[index].y);
        })
        pen.stroke();
    }
}

export default YaphePath2D;