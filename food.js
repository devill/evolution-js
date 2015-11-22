"use strict";

class Food {
    constructor(position) {
        this._position = position;
        this._exists = true;
    }

    position() {
        return this._position;
    }

    drawTo(context) {
        context.beginPath();
        context.strokeStyle = '#000000';
        context.arc(this._position['x'],this._position['y'],5,0,2*Math.PI);
        context.stroke();
    }

    exists() {
        return this._exists;
    }

    remove() {
        this._exists = false;
    }

    visible(position, direction) {
        var visibilityData = this._visibilityData(position, direction);
        return visibilityData['distanceFromEye'] > 0 && visibilityData['distanceFromLineOfSight'] < 5;
    }

    visibilityDistance(position, direction) {
        var visibilityData = this._visibilityData(position, direction);
        return visibilityData['distanceFromEye'];
    }

    visibilityColor(position, direction) {
        return { r:0, g:0, b:0 };
    }

    _visibilityData(position, direction) {
        let rx = this._position['x'] - position['x'];
        let ry = this._position['y'] - position['y'];

        let nx = rx * Math.cos(direction) - ry * Math.sin(direction);
        let ny = rx * Math.sin(direction) + ry * Math.cos(direction);

        return {distanceFromEye: nx, distanceFromLineOfSight: Math.abs(ny) };
    }

}