"use strict";

let Thing = require('./thing');
let Brain = require('./brain');
let Food = require('./food');

class Creature extends Thing {
    constructor(world, positon, iteration_number) {
        super();
        this._position = positon;
        this._born_in_iteration = iteration_number;
        this._world = world;
        this._mid_layer_size = 20;

        this._direction = Math.random() * 2 * Math.PI;
        this._speed = 0;
        this._eye_size = 0.27*Math.PI;
        this._energy = 5000;
        this._alive = true;
        this._time_since_last_egg_layed = 0;
        this._time_since_last_fire = 0;
        this._fire_power = 0;
        this._low_frequency_random = Math.random()*100;

        this._sight_resolution = 10;

        this._sight = [];
        for(let i = 0; i < this._sight_resolution; i++) {
            this._sight.push({ r:128, g:128, b:128, d:10000 });
        }
    }

    setDna(dna) {
        this._dna = dna;
        this._brain = new Brain(this._dna);
        this._eye_size = dna.eye_size;
    }

    generateRandomDna() {
        this.setDna({
            first_layer: Creature.randomMatrix(this._mid_layer_size, this._sight_resolution*4+5),
            second_layer: Creature.randomMatrix(4, this._mid_layer_size),
            egg_color: Math.random() * 360,
            color: Math.random() * 360,
            eye_size: (0.17 + 0.1*Math.random())*Math.PI
        });
    }

    static randomMatrix(rows, cols) {
        let result = [];
        for(let i = 0; i < rows; ++i) {
            let v = [];
            for(let j = 0; j < cols; ++j) {
                v.push(2*Math.random()-1);
            }
            result.push(v);
        }
        return result;
    }

    see(things) {
        for(let i = 0; i < this._sight_resolution; i++) {
            var sightDirection = this._direction + 2*(i - this._sight_resolution/2) * this._eye_size / this._sight_resolution;

            let result = {r: 128, g: 128, b: 128, d: this.seeClosestWallDistance(sightDirection)};

            things.forEach(thing => {
                if (thing.visible(this._position, sightDirection)) {
                    let distance = thing.visibilityDistance(this._position, sightDirection);

                    if (result.d == null || result.d > distance) {
                        result.d = distance;
                        let color = thing.visibilityColor(this._position, sightDirection);
                        result['r'] = color['r'];
                        result['g'] = color['g'];
                        result['b'] = color['b'];
                    }
                }
            });
            this._sight[i] = result;
        }
    }

    seeClosestWallDistance() {
        let t = [
                (-this._position['x']) / Math.cos(this._direction),
                (-this._position['y']) / Math.sin(this._direction),
                (1600-this._position['x']) / Math.cos(this._direction),
                (900-this._position['y']) / Math.sin(this._direction)
            ];
        t = t.filter(v => { return v && v >= 0; });
        return Math.min.apply(Math, t);
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
        return hsl2rgb(this._dna.color, 100, 50);
    }

    drawTo(context, thisIteration) {
        this._drawBody(context);
        this._drawEye(context);
        this._drawEnergy(context);
        context.fillText(Math.floor((thisIteration-this._born_in_iteration)/1000),this._position['x']+20, this._position['y']+20);
    }

    _drawBody(context) {
        context.beginPath();
        let color = hsl2rgb(this._dna.color, 100, 50);
        context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
        context.moveTo(this._position['x'], this._position['y']);
        context.arc(this._position['x'], this._position['y'], 20, this._direction + this._eye_size, this._direction - this._eye_size);
        context.lineTo(this._position['x'], this._position['y']);
        context.stroke();

        if(this._external_dna) {
            let egg_color = hsl2rgb(this._external_dna.egg_color, 100, 50);
            context.strokeStyle = `rgb(${egg_color.r},${egg_color.g},${egg_color.b})`;
            context.beginPath();
            context.arc(this._position['x'], this._position['y'], 5, this._direction + this._eye_size, this._direction - this._eye_size);
            context.stroke();
        }

    }
    
    _drawEye(context) {
        for(let i = 0; i < this._sight_resolution; i++) {
            context.beginPath();
            let color = this._sight[i];
            let angle = this._direction + 2*(i - this._sight_resolution/2) * this._eye_size / this._sight_resolution;
            context.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
            context.arc(this._position['x'], this._position['y'], 16, angle, angle + 2*this._eye_size / this._sight_resolution);
            context.stroke();
        }

    }

    _drawEnergy(context) {
        context.strokeStyle = '#000000';
        context.beginPath();
        let arcAngle = Math.PI - (this._energy / 5000 + 0.1);
        context.arc(this._position['x'], this._position['y'], 16, this._direction + arcAngle, this._direction - arcAngle);
        context.stroke();

        context.strokeStyle = 'rgb(200,0,0)';
        context.beginPath();
        let arcAngle2 = Math.PI - (this._fire_power / 2500 + 0.1);
        context.arc(this._position['x'], this._position['y'], 12, this._direction + arcAngle2, this._direction - arcAngle2);
        context.stroke();
    }

    iterate() {
        this._looseEnergy();

        var status = this.buildStatusVector();
        let thought = this._brain.think(status);

        this._updateSpeed(thought[0], thought[1]);
        this._updatePosition();
        this._shoot(thought[3] > 0.99999);
        this._reproduce(thought[2]);
    }

    buildStatusVector() {
        if (Math.random() < 0.01) {
            this._low_frequency_random = Math.random() * 100;
        }
        let status = [this._energy, this._speed, (this._external_dna ? this._external_dna.color : -180), Math.random() * 100, this._low_frequency_random];
        for (let i = 0; i < this._sight_resolution; i++) {
            status.push(this._sight[i]['r'], this._sight[i]['g'], this._sight[i]['b'], this._sight[i]['d']);
        }
        return status;
    }
    
    _shoot(trigger) {
        ++this._fire_power;
        ++this._time_since_last_fire;
        if(trigger && this._fire_power > 300 && this._time_since_last_fire > 50) {
            var bullet_position = {
                x: this._position.x + 30 * Math.cos(this._direction),
                y: this._position.y + 30 * Math.sin(this._direction)
            };
            this._world.addBullet(bullet_position, this._direction);
            this._fire_power -= 300;
            this._time_since_last_fire = 0;
            this._energy -= 500;
        }
        this._fire_power = Creature._keepInRange(this._fire_power,0,5000);
    }

    _reproduce(sexual_desire) {
        this._time_since_last_egg_layed += 1;
        if (this._energy > 8000 && this._time_since_last_egg_layed > 1000) {
            if (sexual_desire < 0.3) {
                this._layEgg();
            } else if (sexual_desire > 0.7) {
                if(this._external_dna) {
                    this._createOffspring();
                } else {
                    return;
                }
            } else {
                return;
            }
            this._energy -= 2500;
            this._time_since_last_egg_layed = 0;
        }
    }

    _createOffspring() {
        this._world.injectCreature(this.mix(this._external_dna), {x: this._position.x, y: this._position.y});
        this._external_dna = null;
    }

    _layEgg() {
        var egg_position = {
            x: Creature._keepInRange(this._position.x - 30 * Math.cos(this._direction), 20, 1560),
            y: Creature._keepInRange(this._position.y - 30 * Math.sin(this._direction), 20, 860)
        };
        this._world.addEgg(egg_position, hsl2rgb(this._dna.egg_color, 100, 90), this._dna);
    }

    distance(other) {
        let l = this._position;
        let r = other.position();
        return Math.sqrt(Math.pow(l['x'] - r['x'], 2) + Math.pow(l['y'] - r['y'], 2))
    }

    feed() {
        this._energy += 5000;
        this._energy = Creature._keepInRange(this._energy, 0, 10000);
    }

    takeHit() {
        this._energy -= 2000;
    }

    takeEgg(e) {
        this._external_dna = e._dna;
    }

    mix(other_dna) {
        return {
            first_layer: this.mutateEye(Creature.mutateMatrix(Creature.mixMatrix(this._dna.first_layer, other_dna.first_layer), 0.1)),
            second_layer: Creature.mutateMatrix(Creature.mixMatrix(this._dna.second_layer, other_dna.second_layer),0.01),
            egg_color: Creature.mutateValue(Math.random() < 0.5 ? this._dna.egg_color : other_dna.egg_color, 2),
            color: Creature.mutateValue(Math.random() < 0.5 ? this._dna.color : other_dna.color, 2),
            eye_size: Creature._keepInRange(Creature.mutateValue(Math.random() < 0.5 ? this._dna.eye_size : other_dna.eye_size, 0.02*Math.PI), 0.17*Math.PI, 0.27*Math.PI)
        };
    }

    static mixMatrix(lhs, rhs) {
        let result = [];
        for(let i = 0; i < lhs.length; ++i) {
            var rnd = Math.random();
            let r = [];
            if(rnd < 0.2) {
                let cut = Math.floor(Math.random() * lhs[i].length);
                r = lhs[i].slice(0,cut).concat(rhs[i].slice(cut,rhs[i].length))
            } else {
                r = (rnd < 0.6 ? lhs[i] : rhs[i]);
            }
            result.push(r);
        }
        return result;
    }

    static mutateValue(value, max_mutation) {
        return value + (Math.random() < 0.01 ? max_mutation*2*Math.random()-max_mutation: 0)
    }

    static mutateMatrix(matrix, p) {
        if (Math.random() > p) { return matrix; }
        let i = Math.floor(Math.random()*matrix.length);
        let j = Math.floor(Math.random()*matrix[i].length);
        matrix[i][j] += Math.random()*4-1;
        return matrix;
    }

    mutateEye(matrix) {
        if(Math.random() > 0.9) {
	    let i = (matrix[0].length - 4*this._sight_resolution) + 4*Math.floor(Math.random()*(this._sight_resolution - 1));
            let tmp = 0;
            for(let k = 0; k < matrix.length; ++k) {
                tmp = matrix[k][i+0]; matrix[k][i+0] = matrix[k][i+4]; matrix[k][i+4] = tmp;
                tmp = matrix[k][i+1]; matrix[k][i+1] = matrix[k][i+5]; matrix[k][i+5] = tmp;
                tmp = matrix[k][i+2]; matrix[k][i+2] = matrix[k][i+6]; matrix[k][i+6] = tmp;
                tmp = matrix[k][i+3]; matrix[k][i+3] = matrix[k][i+7]; matrix[k][i+7] = tmp;
            }
        }
        return matrix;
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
        this._speed = Creature._keepInRange(this._speed, 0, 2);
    }

    _updatePosition() {
        this._position['x'] += this._speed * Math.cos(this._direction);
        this._position['y'] += this._speed * Math.sin(this._direction);

        this._position['x'] = Creature._keepInRange(this._position['x'], 20, 1580);
        this._position['y'] = Creature._keepInRange(this._position['y'], 20, 880);
    }

    _looseEnergy() {
        this._energy -= this._speed+1;
        if (this._energy < 1) {
            this._alive = false;
        }
        this._energy = Creature._keepInRange(this._energy, 0, 10000);
    }

    static _keepInRange(value, min, max) {
        return Math.min(max,Math.max(min, value));
    }
}

module.exports = Creature;

