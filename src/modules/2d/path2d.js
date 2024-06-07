import Vector2D from "./vector2d.js";

class YaphePath2D {
    constructor() {
        this.points = [];
        this.equation = null;
    }
    addPoint(x, y) {
        const point = new Vector2D(x, y);
        this.points.push(point);
    }
    setEquation(equationFunction) {
        if (typeof equationFunction === 'function') {
            this.equation = equationFunction;
        } else {
            console.error(`Invalid equation function provided.`);
        }
    }    
    generatePointsFromEquation(startX, endX, step) {
        if (this.equation) {
            for (let x = startX; x < endX; x += step) {
                const point = this.equation(x);
                this.addPoint(point.x, point.y);
            }
        } else {
            console.error(`Equation is not set. Please set an equation for your function`);
        }
    }
    getPointAt(x) {
        const point = this.equation(x);
        return point;
    }
    getPoints() {
        return this.points;
    }
    show(pen) {
        pen.beginPath();
        pen.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach((point, i) => {
            pen.lineTo(point.x, point.y);
        })
        pen.stroke();
    }
}

export default YaphePath2D;