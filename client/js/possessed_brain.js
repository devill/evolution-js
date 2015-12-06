"use strict";

class PossessedBrain {
    constructor(brain) {
        this._brain = brain;
        this._acceleration = 0;
        this._acceleration_angle = 0.5;
        this._trigger = 0;
        this._sexual_desire = 0.5;

        document.addEventListener("keydown", (event) => {
            if(event.keyCode == 32) { this._trigger = 1; }
            if(event.keyCode == 38) { this._acceleration = 0.55; }
            if(event.keyCode == 37) { this._acceleration_angle = 0.3; }
            if(event.keyCode == 39) { this._acceleration_angle = 0.7; }
            if(event.keyCode == 86) { this._sexual_desire = 0; }
            if(event.keyCode == 66) { this._sexual_desire = 1; }
        });
        document.addEventListener("keyup", (event) => {
            if(event.keyCode == 32) { this._trigger = 0; }
            if(event.keyCode == 38) { this._acceleration = 0.3; }
            if(event.keyCode == 37) { this._acceleration_angle = 0.5; }
            if(event.keyCode == 39) { this._acceleration_angle = 0.5; }
            if(event.keyCode == 86) { this._sexual_desire = 0.5; }
            if(event.keyCode == 66) { this._sexual_desire = 0.5; }
        });
    }

    think(input) {
        return [
            this._acceleration_angle,
            this._acceleration,
            this._sexual_desire,
            this._trigger
        ];
    }
}

module.exports = PossessedBrain;