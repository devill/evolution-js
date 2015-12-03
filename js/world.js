"use strict";

let Thing = require('./thing');
let Creature = require('./creature');
let Food = require('./food');
let Bullet = require('./bullet');
let Egg = require('./egg');

class World extends Thing {
    constructor(canvas_object) {
        super();
        this._food = [];
        this._creatures = [];
        this._eggs = [];
        this._bullets = [];
        this._iterationNumber = 0;

        this.context = canvas_object.getContext("2d");
    }

    getIterationNumber() {
        return this._iterationNumber;
    }

    injectCreature(dna, position) {
        var creature = new Creature(this, position, this._iterationNumber);
        creature.setDna(dna);
        this._creatures.push(creature);
    }

    generateRandomCreatures(n) {
        for (let i = 0; i < n; i++) {
            var creature = new Creature(this, {x: Math.random() * 1600, y: Math.random() * 900}, this._iterationNumber);
            creature.generateRandomDna();
            this._creatures.push(creature);
        }
    }
    
    iteration() {
        ++this._iterationNumber;

        this._creatures.forEach(creature => {
            creature.see(this._creatures.concat(this._food).concat(this._eggs).concat(this._bullets));
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
        if(this._iterationNumber % 100 == 0 && this._creatures.length < 20) {
            this.generateRandomCreatures(1);
        }

        if (this._creatures.length < 25 && Math.random() < 0.01) {
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
            creature.drawTo(this.context, this._iterationNumber);
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
        this._bullets.push(new Bullet(position, direction))
    }
}

module.exports = World;

