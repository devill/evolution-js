"use strict";

class Bullet extends Thing {
    constructor(position, direction) {
        super();
        this._position = position;
        this._direction = direction;
        this._speed = 6;
        this._exists = true;
    }

    position() {
        return this._position;
    }

    drawTo(context) {
        context.beginPath();
        context.strokeStyle = 'rgb(200, 0, 0)';
        context.arc(this._position['x'],this._position['y'],3,0,2*Math.PI);
        context.stroke();
    }

    iterate() {
        this._position['x'] += this._speed * Math.cos(this._direction);
        this._position['y'] += this._speed * Math.sin(this._direction);

        this._position['x'] = this._keepInRange(this._position['x'], 0, 1600);
        this._position['y'] = this._keepInRange(this._position['y'], 0, 900);
    }

    _keepInRange(value, min, max) {
        if (value < min || value > max) {
            this.remove();
        }
        return value;
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
        return { r:200, g:0, b:0 };
    }
}