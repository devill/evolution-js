"use strict";

let Thing = require('./thing');
let Creature = require('./creature');
let Food = require('./food');
let Bullet = require('./bullet');
let Egg = require('./egg');
let Wall = require('./wall');
let PossessedBrain = require('./possessed_brain');
let SimpleDna = require('./simple_dna');

class World extends Thing {
    constructor(canvas_object) {
        super();
        this._food = [];
        this._creatures = [];
        this._eggs = [];
        this._bullets = [];
        this._walls = [
            new Wall([{x:800, y:200},{x:800, y:400}]),
            new Wall([{x:800, y:600},{x:800, y:800}]),
            new Wall([{x:0, y:450},{x:600, y:450}]),
            new Wall([{x:1000, y:300},{x:1400, y:600}])
        ];
        this._iteration_number = 0;
        this._random_creatures = 0;
        this._mated_creatures = 0;

        this.context = canvas_object.getContext("2d");

        document.addEventListener("keypress", e => {
            if(e.keyCode == 110) {
                let dna = SimpleDna.generateRandomDna();
                let creature = new Creature(this, dna, this.randomPositionForCreature(), this._iteration_number);
                creature._brain = new PossessedBrain(creature._brain);
                this._creatures.push(creature);
            }
        });
    }

    getWalls() {
        return this._walls;
    }

    getIterationNumber() {
        return this._iteration_number;
    }

    injectCreature(dna, position) {
        this._mated_creatures++;
        var creature = new Creature(this, dna, position, this._iteration_number);
        this._creatures.push(creature);
    }

    generateRandomCreatures(n) {
        this._random_creatures++;
        for (let i = 0; i < n; i++) {
            let dna = SimpleDna.generateRandomDna();
            let creature = new Creature(this, dna, this.randomPositionForCreature(), this._iteration_number);
            this._creatures.push(creature);
        }
    }

    randomPositionForCreature() {
        var position = {};
        do {
            position = {x: Math.random() * 1600, y: Math.random() * 900};
        } while(this._collidesWithWall(position, 20));
        return position;
    }

    _collidesWithWall(point) {
        let collides = false;
        this._walls.forEach(w => {
            collides = collides || w.pointCollides(point);
        });
        return collides
    }
    
    iteration() {
        ++this._iteration_number;

        var things = this._creatures.concat(this._food).concat(this._eggs).concat(this._bullets).concat(this._walls);
        this._creatures.forEach(creature => {
            creature.see(things);
        });

        this._creatures.forEach(creature => {
            creature.iterate();
            if(!creature.alive()) {
                this._food.push(new Food(creature.position()));
            }
        });

        this._creatures = this._creatures.filter(creature => {
            return creature.alive();
        });

        this.feedCreatures();
        this.detectBulletHits();
        this.reproduce();
        if(this._iteration_number % 100 == 0 && this._creatures.length < 20) {
            this.generateRandomCreatures(1);
        }

        if (this._creatures.length < 40 && this._food.length < 50 && Math.random() < 0.03) {
            this._food.push(new Food({x:20+Math.random()*1560,y:20+Math.random()*860}));
        }

        setTimeout(() => { this.iteration() }, 0);
    }

    detectBulletHits() {
        this._bullets.forEach(bullet => {
            bullet.iterate();
        });
        this._creatures.forEach(creature => {
            this._bullets.forEach(b => {
                if (creature.distance(b) < 20) {
                    creature.takeHit();
                    b.remove();
                }
            });
        });
        this._bullets = this._bullets.filter(bullet => {
            return bullet.exists();
        });
    }

    feedCreatures() {
        this._creatures.forEach(creature => {
            this._food.forEach(f => {
                if (creature.distance(f) < 20) {
                    creature.feed();
                    f.remove();
                }
            });
        });
        this._food = this._food.filter(f => {
            return f.exists();
        });
    }

    reproduce() {
        this._creatures.forEach(creature => {
            this._eggs.forEach(e => {
                if (creature.distance(e) < 20) {
                    creature.takeEgg(e);
                    e.remove();
                }
            });
        });
        this._eggs = this._eggs.filter(e => {
            return e.exists();
        });
    }

    drawWorld() {
        this.context.lineWidth = 2;
        this.context.clearRect(0, 0, 1600, 900);
        this._walls.forEach(w => {
            w.drawTo(this.context);
        });
        this._eggs.forEach(e => {
            e.drawTo(this.context);
        });
        this._food.forEach(f => {
            f.drawTo(this.context);
        });
        this._bullets.forEach(b => {
            b.drawTo(this.context);
        });
        this._creatures.forEach(creature => {
            creature.drawTo(this.context, this._iteration_number);
        });

        if(this._creatures[0]) {
            this.context.strokeStyle = '#ff0055';
            let oldest_creature = this._creatures[0].position();
            this.context.rect(oldest_creature.x - 30, oldest_creature.y - 30,60,60);
            this.context.stroke();
        }
    }

    addEgg(position, color, dna) {
        this._eggs.push(new Egg(position, color, dna))
    }

    addBullet(position, direction) {
        this._bullets.push(new Bullet(position, direction, this))
    }
}

module.exports = World;

