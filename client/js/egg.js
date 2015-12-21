"use strict";

let Thing = require('./thing');

class Egg extends Thing {
    constructor(position, color, dna) {
        super();
        this._position = position;
        this._color = color;
        this._exists = true;
        this._dna = dna;
    }

    position() {
        return this._position;
    }

    drawTo(context) {
        context.beginPath();
        context.strokeStyle = `rgb(${this._color.r},${this._color.g},${this._color.b})`;
        context.arc(this._position['x'],this._position['y'],5,0,2*Math.PI);
        context.arc(this._position['x'],this._position['y'],2,0,2*Math.PI);
        context.stroke();

        if (this._dna.constructor.name == 'NeatDna') {
            context.beginPath();
            context.strokeStyle = `rgb(0,0,0)`;
            context.arc(this._position['x'],this._position['y'],1,0,1*Math.PI);
            context.stroke();
        }
    }

    exists() {
        return this._exists;
    }

    remove() {
        this._exists = false;
    }

    radius() {
        return 5;
    }

    visibilityColor(position, direction) {
        return this._color;
    }
}

module.exports = Egg;

