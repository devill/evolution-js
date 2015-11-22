"use strict";

class Creature {
    constructor(positon, dna) {
        this._position = positon;
        this._dna = dna;

        this._hue = Math.random() * 360;
        this._direction = Math.random() * 2 * Math.PI;
        this._speed = Math.random()*2;
        this._mouthSize = 0.27*Math.PI;
        this._energy = 10000;
        this._alive = true;
    }

    drawTo(context) {
        context.beginPath();
        let color = hsl2rgb(this._hue, 100, 50);
        context.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        context.moveTo(this._position['x'],this._position['y']);
        context.arc(this._position['x'],this._position['y'],20,this._direction + this._mouthSize, this._direction - this._mouthSize);
        context.lineTo(this._position['x'],this._position['y']);
        context.stroke();
        context.beginPath();
        let arcAngle = Math.PI - (this._energy/5000+0.1);
        context.arc(this._position['x'],this._position['y'],18,this._direction + arcAngle, this._direction - arcAngle);
        context.stroke();
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

    iterate() {
        this.looseEnergy();
        this.updateSpeed();
        this.updatePosition();
    }

    updateSpeed() {
        this._direction += (Math.random() - 0.47) / 10;

        this._speed += (Math.random() - 0.5) / 10;
        this._speed = this._keepInRange(this._speed, 0, 2);
    }

    updatePosition() {
        this._position['x'] += this._speed * Math.cos(this._direction);
        this._position['y'] += this._speed * Math.sin(this._direction);

        this._position['x'] = this._keepInRange(this._position['x'], 20, 1580);
        this._position['y'] = this._keepInRange(this._position['y'], 20, 880);
    }

    looseEnergy() {
        this._energy -= this._speed*2;
        if (this._energy < 1) {
            this._alive = false;
        }
        this._energy = this._keepInRange(this._energy, 0, 10000);
    }

    position() {
        return this._position;
    }

    _keepInRange(value, min, max) {
        return Math.min(max,Math.max(min, value));
    }
}
