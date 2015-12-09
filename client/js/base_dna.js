"use strict";

class BaseDna {
    constructor(dna) {
        this._dna = dna;
    }

    eyeSize() {
        return this._dna.eye_size;
    }

    sightResolution() {
        return this._dna.sight_resolution;
    }

    visibilityColor() {
        return hsl2rgb(this._dna.color, 100, 50);
    }

    eggColor() {
        return hsl2rgb(this._dna.egg_color, 100, 90);
    }

    _mixEggColor(other_dna) {
        return BaseDna.mutateValue(Math.random() < 0.5 ? this._dna.egg_color : other_dna._dna.egg_color, 10);
    }

    _mixColor(other_dna) {
        return BaseDna.mutateValue(Math.random() < 0.5 ? this._dna.color : other_dna._dna.color, 10);
    }

    _mixEyeSize() {
        return BaseDna._keepInRange(BaseDna.mutateValue(Math.random() < 0.5 ? this._dna.eye_size : other_dna._dna.eye_size, 0.01*Math.PI), 0.17*Math.PI, 0.27*Math.PI);
    }

    static mutateValue(value, max_mutation) {
        return value + (Math.random() < 0.3 ? max_mutation*2*Math.random()-max_mutation: 0)
    }

    static _keepInRange(value, min, max) {
        return Math.min(max,Math.max(min, value));
    }

}

module.exports = BaseDna;