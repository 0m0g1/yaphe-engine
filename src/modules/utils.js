function angleBetweenPoints(a, b) {
    // Calculate differences in x and y coordinates
    const delta = b.copy().subtract(a);

    // Calculate the angle using atan2
    let angle = Math.atan2(delta.y, delta.x);
    
    // Convert angle to degrees if needed
    angle = angle * (180 / Math.PI);
    
    // Ensure the angle is in the range [0, 360)
    if (angle < 0) {
        angle += 360;
    }
    
    return angle;
}

const utils = Object.freeze({
    angleBetweenPoints: (a, b) => {return angleBetweenPoints(a, b)}
})

export default utils;