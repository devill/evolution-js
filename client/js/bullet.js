"use strict";

let Thing = require('./thing');

class Bullet extends Thing {
    constructor(position, direction, world) {
        super();
        this._position = position;
        this._direction = direction;
        this._speed = 6;
        this._exists = true;
        this._world = world;
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
        let new_position = {
            x: this._position['x'] + this._speed * Math.cos(this._direction),
            y: this._position['y'] + this._speed * Math.sin(this._direction)
        };

        if(this._collidesWithWall(new_position)) {
            this.remove();
            return;
        }

        this._position['x'] = this._keepInRange(new_position['x'], 0, 1600);
        this._position['y'] = this._keepInRange(new_position['y'], 0, 900);
    }

    _collidesWithWall(new_position) {
        let collides = false;
        this._world.getWalls().forEach(wall => {
            collides = collides || wall.vectorColides([this._position, new_position], 5);
        });
        return collides;
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
        let visibilityData = this._visibilityData(position, direction);
        return visibilityData['distanceFromEye'] > 0 && visibilityData['distanceFromLineOfSight'] < 5;
    }

    visibilityDistance(position, direction) {
        let visibilityData = this._visibilityData(position, direction);
        return visibilityData['distanceFromEye'];
    }

    visibilityColor(position, direction) {
        return { r:200, g:0, b:0 };
    }
}

module.exports = Bullet;

