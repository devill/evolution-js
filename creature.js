"use strict";

class Creature {
    constructor(positon, dna) {
        this._position = positon;
        this._dna = dna;

        this._hue = Math.random() * 360;
        this._direction = Math.random() * 2 * Math.PI;
        this._speed = Math.random()*2;
        this._eyeSize = 0.27*Math.PI;
        this._energy = 10000;
        this._alive = true;
        this._sight = { r:128, g:128, b:128, d:null };
    }

    see(things) {
        let result = { r:128, g:128, b:128, d:null };
        let self = this;
        things.forEach(function (thing) {
            if(thing.visible(self._position, self._direction)) {
                let distance = thing.visibilityDistance(self._position, self._direction);

                if(result.d == null || result.d > distance) {
                    result.d = distance;
                    let color = thing.visibilityColor(self._position, self._direction);
                    result['r'] = color['r'];
                    result['g'] = color['g'];
                    result['b'] = color['b'];
                }
            }
        });
        this._sight = result;
    }

    visible(position, direction) {
        var visibilityData = this._visibilityData(position, direction);
        return visibilityData['distanceFromEye'] > 0 && visibilityData['distanceFromLineOfSight'] < 20;
    }

    visibilityDistance(position, direction) {
        var visibilityData = this._visibilityData(position, direction);
        return visibilityData['distanceFromEye'];
    }

    visibilityColor(position, direction) {
        return hsl2rgb(this._hue, 100, 50);
    }

    _visibilityData(position, direction) {
        let rx = this._position['x'] - position['x'];
        let ry = this._position['y'] - position['y'];

        let nx = rx * Math.cos(-direction) - ry * Math.sin(-direction);
        let ny = rx * Math.sin(-direction) + ry * Math.cos(-direction);

        return {distanceFromEye: nx, distanceFromLineOfSight: Math.abs(ny) };
    }

    drawTo(context) {
        this._drawBody(context);
        this._drawEye(context);
        this._drawEnergy(context);
    }

    _drawBody(context) {
        context.beginPath();
        let color = hsl2rgb(this._hue, 100, 50);
        context.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        context.moveTo(this._position['x'], this._position['y']);
        context.arc(this._position['x'], this._position['y'], 20, this._direction + this._eyeSize, this._direction - this._eyeSize);
        context.lineTo(this._position['x'], this._position['y']);
        context.stroke();
    }
    
    _drawEye(context) {
        context.beginPath();
        let color = this._sight;
        context.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        context.arc(this._position['x'], this._position['y'], 16, this._direction - this._eyeSize, this._direction + this._eyeSize);
        context.stroke();
    }

    _drawEnergy(context) {
        context.strokeStyle = '#000000';
        context.beginPath();
        let arcAngle = Math.PI - (this._energy / 5000 + 0.1);
        context.arc(this._position['x'], this._position['y'], 18, this._direction + arcAngle, this._direction - arcAngle);
        context.stroke();
    }

    iterate() {
        this._looseEnergy();
        this._updateSpeed();
        this._updatePosition();
    }

    distance(other) {
        let l = this._position;
        let r = other.position()
        return Math.sqrt(Math.pow(l['x'] - r['x'], 2) + Math.pow(l['y'] - r['y'], 2))
    }

    feed() {
        this._energy += 5000;
        this._energy = this._keepInRange(this._energy, 0, 10000);
    }

    alive() {
        return this._alive;
    }

    position() {
        return this._position;
    }

    _updateSpeed() {
        this._direction += (Math.random() - 0.47) / 10;

        this._speed += (Math.random() - 0.5) / 10;
        this._speed = this._keepInRange(this._speed, 0, 2);
    }

    _updatePosition() {
        this._position['x'] += this._speed * Math.cos(this._direction);
        this._position['y'] += this._speed * Math.sin(this._direction);

        this._position['x'] = this._keepInRange(this._position['x'], 20, 1580);
        this._position['y'] = this._keepInRange(this._position['y'], 20, 880);
    }

    _looseEnergy() {
        this._energy -= this._speed*2;
        if (this._energy < 1) {
            this._alive = false;
        }
        this._energy = this._keepInRange(this._energy, 0, 10000);
    }

    _keepInRange(value, min, max) {
        return Math.min(max,Math.max(min, value));
    }
}
