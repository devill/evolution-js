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
}