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
        return this._bimodalHueMix(this._dna.egg_color, other_dna._dna.egg_color);
    }

    _mixColor(other_dna) {
        return this._bimodalHueMix(this._dna.color, other_dna._dna.color);
    }

    _mixEyeSize(other_dna) {
        return BaseDna._keepInRange(BaseDna.mutateValue(Math.random() < 0.5 ? this._dna.eye_size : other_dna._dna.eye_size, 0.01*Math.PI), 0.17*Math.PI, 0.27*Math.PI);
    }

    _bimodalHueMix(lhs, rhs) {
        let smaller = (lhs < rhs) ? lhs : rhs;
        let larger = (lhs >= rhs) ? lhs : rhs;

        if(larger - smaller < 360 + smaller - larger) {
            return Math.floor(this._bimodalValueMix(smaller,larger) + 360) % 360;
        } else {
            return Math.floor(this._bimodalValueMix(smaller+360,larger) + 360) % 360;
        }
    }

    _bimodalValueMix(lhs, rhs) {
        let p = Math.bimodal_normal();
        return p*lhs+(1-p)*rhs;
    }

    static mutateValue(value, max_mutation) {
        return value + (Math.random() < 0.3 ? max_mutation*2*Math.random()-max_mutation: 0)
    }

    static _keepInRange(value, min, max) {
        return Math.min(max,Math.max(min, value));
    }

}

module.exports = BaseDna;