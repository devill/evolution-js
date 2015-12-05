"use strict";

class Wall {
    constructor(corners) {
        this._corners = corners;
    }

    visible(position, direction, angle) {


        let visibility_data = this._corners.map(c => { return this._relativeCoordinates(position, c, direction); });

        if(Math.abs(visibility_data[1]['y'] - visibility_data[0]['y']) < 0.00001) { return false; }

        if(this._relativeCoordinateVisible(visibility_data[0], angle) || this._relativeCoordinateVisible(visibility_data[1], angle)) {
            return true;
        }

        let w = visibility_data[1]['y'] / (visibility_data[1]['y'] - visibility_data[0]['y']);
        let intersection_point = { x: w * visibility_data[0]['x'] + (1 - w) * visibility_data[1]['x'], y:0 };

        return this._relativeCoordinateVisible(intersection_point, angle);
    }

    _relativeCoordinateVisible(relative_corner_coordinates, angle) {
        return relative_corner_coordinates['x'] > 0 &&
            Math.abs(relative_corner_coordinates['y']) < relative_corner_coordinates['x'] * Math.tan(angle);
    }

    visibilityDistance(position, direction) {
        let visibility_data = this._corners.map(c => { return this._relativeCoordinates(position, c, direction); });

        let w = visibility_data[1]['y'] / (visibility_data[1]['y'] - visibility_data[0]['y']);

        if(w < 0) { return this._distance(position, this._corners[1]); }
        if(w > 1) { return this._distance(position, this._corners[0]); }

        return w * visibility_data[0]['x'] + (1 - w) * visibility_data[1]['x'];
    }

    _distance(p1, p2) {
        return Math.sqrt(Math.pow(p1['x']-p2['x'],2) + Math.pow(p1['y']-p2['y'],2));
    }

    visibilityColor() {
        return { r: 128, g: 128, b: 128 }
    }

    _relativeCoordinates(creaturePosition, cornerPosition, direction) {
        let rx = cornerPosition['x'] - creaturePosition['x'];
        let ry = cornerPosition['y'] - creaturePosition['y'];

        let nx = rx * Math.cos(-direction) - ry * Math.sin(-direction);
        let ny = rx * Math.sin(-direction) + ry * Math.cos(-direction);

        return {
            x: nx,
            y: ny
        };
    }

    drawTo(context) {
        let color = this.visibilityColor();
        context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
        context.beginPath();
        context.moveTo(this._corners[0]['x'],this._corners[0]['y']);
        context.lineTo(this._corners[1]['x'],this._corners[1]['y']);
        context.stroke();
    }
}

module.exports = Wall;
