"use strict";

class Creature extends Thing {
    constructor(world, positon, iteration_number) {
        super();
        this._position = positon;
        this._born_in_iteration = iteration_number;
        this._world = world;
        this._mid_layer_size = 7;

        this._hue = Math.random() * 360;
        this._direction = Math.random() * 2 * Math.PI;
        this._speed = 0;
        this._eye_size = 0.27*Math.PI;
        this._energy = 10000;
        this._alive = true;
        this._time_since_last_egg_layed = 0;

        this._sightResolution = 20;

        this._sight = [];
        for(let i = 0; i < this._sightResolution; i++) {
            this._sight.push({ r:128, g:128, b:128, d:10000 });
        }
    }

    setDna(dna) {
        this._dna = dna;
        this._brain = new Brain(this._dna);
    }

    generateRandomDna() {
        this.setDna({
            first_layer: this.randomMatrix(this._mid_layer_size, this._sightResolution*4+3),
            second_layer: this.randomMatrix(3, this._mid_layer_size),
            egg_color: Math.random() * 360
        });
    }

    randomMatrix(rows, cols) {
        let result = [];
        for(let i = 0; i < rows; ++i) {
            let v = [];
            for(let j = 0; j < cols; ++j) {
                v.push(100*(2*Math.random()-1));
            }
            result.push(v);
        }
        return result;
    }

    see(things) {
        for(let i = 0; i < this._sightResolution; i++) {
            var sightDirection = this._direction + 2*(i - this._sightResolution/2) * this._eye_size / this._sightResolution;

            let result = {r: 128, g: 128, b: 128, d: 10000};
            let self = this;
            things.forEach(function (thing) {
                if (thing.visible(self._position, sightDirection)) {
                    let distance = thing.visibilityDistance(self._position, sightDirection);

                    if (result.d == null || result.d > distance) {
                        result.d = distance;
                        let color = thing.visibilityColor(self._position, sightDirection);
                        result['r'] = color['r'];
                        result['g'] = color['g'];
                        result['b'] = color['b'];
                    }
                }
            });
            this._sight[i] = result;
        }
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

    drawTo(context, thisIteration) {
        this._drawBody(context);
        this._drawEye(context);
        this._drawEnergy(context);
        context.fillText(Math.floor((thisIteration-this._born_in_iteration)/1000),this._position['x']+20, this._position['y']+20);
    }

    _drawBody(context) {
        context.beginPath();
        let color = hsl2rgb(this._hue, 100, 50);
        context.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
        context.moveTo(this._position['x'], this._position['y']);
        context.arc(this._position['x'], this._position['y'], 20, this._direction + this._eye_size, this._direction - this._eye_size);
        context.lineTo(this._position['x'], this._position['y']);
        context.stroke();
    }
    
    _drawEye(context) {
        for(let i = 0; i < this._sightResolution; i++) {
            context.beginPath();
            let color = this._sight[i];
            let angle = this._direction + 2*(i - this._sightResolution/2) * this._eye_size / this._sightResolution;
            context.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
            context.arc(this._position['x'], this._position['y'], 16, angle, angle + this._eye_size / this._sightResolution);
            context.stroke();
        }

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

        let status = [this._energy, this._speed, Math.random()];
        for(let i = 0; i < this._sightResolution; i++) {
            status.push(this._sight[i]['r'],this._sight[i]['g'],this._sight[i]['b'],this._sight[i]['d']);
        }

        let thought = this._brain.think(status);

        this._updateSpeed(thought[0], thought[1]);
        this._updatePosition();

        this._time_since_last_egg_layed += 1;
        if(this._energy > 9000 && thought[2] < 0.3 && this._time_since_last_egg_layed > 1000) {
            var egg_position = { x:this._position.x - 30 * Math.cos(this._direction), y:this._position.y - 30 * Math.sin(this._direction) };
            this._world.addEgg(egg_position, hsl2rgb(this._dna.egg_color, 100, 90));
            this._energy -= 2000;
            this._time_since_last_egg_layed = 0;
        }
    }

    distance(other) {
        let l = this._position;
        let r = other.position();
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

    _updateSpeed(accelerationAngle, accelerationRadius) {
        this._direction += (accelerationAngle - 0.5) / 10;

        this._speed += (accelerationRadius - 0.5) / 10;
        this._speed = this._keepInRange(this._speed, 0, 2);
    }

    _updatePosition() {
        this._position['x'] += this._speed * Math.cos(this._direction);
        this._position['y'] += this._speed * Math.sin(this._direction);

        this._position['x'] = this._keepInRange(this._position['x'], 20, 1580);
        this._position['y'] = this._keepInRange(this._position['y'], 20, 880);
    }

    _looseEnergy() {
        this._energy -= this._speed+1;
        if (this._energy < 1) {
            this._alive = false;
        }
        this._energy = this._keepInRange(this._energy, 0, 10000);
    }

    _keepInRange(value, min, max) {
        return Math.min(max,Math.max(min, value));
    }
}
