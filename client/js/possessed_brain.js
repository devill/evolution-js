"use strict";

class PossessedBrain {
    constructor(brain) {
        this._brain = brain;
        this._acceleration = 0;
        this._accelerationAngle = 0.5;
        document.addEventListener("keydown", (event) => {
            console.log('down',event.keyCode);
            if(event.keyCode == 38) { this._acceleration = 0.55; }
            if(event.keyCode == 37) { this._accelerationAngle = 0.3; }
            if(event.keyCode == 39) { this._accelerationAngle = 0.7; }
        });
        document.addEventListener("keyup", (event) => {
            if(event.keyCode == 38) { this._acceleration = 0.3; }
            if(event.keyCode == 37) { this._accelerationAngle = 0.5; }
            if(event.keyCode == 39) { this._accelerationAngle = 0.5; }
        });
    }

    think(input) {
        var original_thought = this._brain.think(input);
        original_thought[0] = this._accelerationAngle;
        original_thought[1] = this._acceleration;
        return original_thought;
    }
}

module.exports = PossessedBrain;