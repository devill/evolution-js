"use strict";

let Config = require('./config');
let Thing = require('./thing');
let Creature = require('./creature');
let Food = require('./food');
let Bullet = require('./bullet');
let Egg = require('./egg');
let Wall = require('./wall');
let PossessedBrain = require('./possessed_brain');

class World extends Thing {
    constructor(canvas_object, dnaFactory, storage) {
        super();
        Config.instance()
            .set('overpopulation_limit', 40)
            .set('maximum_amount_of_food', 40)
            .set('food_generation_probability', 0.01)
            .set('dead_creature_nutrition', 6000)
            .set('default_food_nutrition', 3500)
            .set('minimum_population_size', 20)
            .set('creature_creation_probability',0.01);

        this._food = [];
        this._creatures = [];
        this._eggs = [];
        this._bullets = [];
        this._walls = [
            new Wall([{x:800, y:200},{x:800, y:400}]),
            new Wall([{x:800, y:600},{x:800, y:800}]),
            new Wall([{x:0, y:450},{x:600, y:450}]),
            new Wall([{x:1000, y:600},{x:1400, y:300}]),
            new Wall([{x:Math.floor(Math.random()*1500), y:Math.floor(Math.random()*800)},{x:Math.floor(Math.random()*1500), y:Math.floor(Math.random()*800)}])
        ];
        this._iteration_number = 0;
        this._random_creatures = 0;
        this._resurrected_creatures = 0;
        this._mated_creatures = 0;
        this._uploaded_creatures = 0;
        this._downloaded_creatures = 0;
        this._dna_factory = dnaFactory;
        this._storage = storage;
        this._selected_creature = null;

        this.context = canvas_object.getContext("2d");

        document.addEventListener("keypress", e => {
            if(e.keyCode == 110) {
                this._creatures = this._creatures.filter(creature => {
                    return !creature._brain.possessed();
                });

                let dna = this._dna_factory.build();
                let creature = new Creature(this, dna, this.randomPositionForCreature(), this._iteration_number);
                creature._brain = new PossessedBrain(creature._brain);
                this._creatures.push(creature);
            }
        });

        canvas_object.addEventListener("click", event => {
            if(event.ctrlKey) {
                this._creatures = this._creatures.filter(creature => {
                    return !creature.containsPoint({x:event.layerX, y:event.layerY});
                });
            } else {
                this._selected_creature = this._creatures[0];
                let distance = this._selected_creature.distanceFromPoint({x:event.layerX, y:event.layerY});

                this._creatures.forEach(creature => {
                    if( creature.distanceFromPoint({x:event.layerX, y:event.layerY}) < distance) {
                        this._selected_creature = creature;
                        distance = creature.distanceFromPoint({x:event.layerX, y:event.layerY});
                    }
                });

                if(this._selected_creature) {
                    this._selected_creature._brain.draw();
                }
            }
        });
    }

    getWalls() {
        return this._walls;
    }

    getIterationNumber() {
        return this._iteration_number;
    }

    injectCreature(dna, position, parents) {
        this._mated_creatures++;
        let creature = new Creature(this, dna, position, this._iteration_number);
        this._storage.addDna(dna);
        this._uploaded_creatures++;
        parents.forEach(parent => {
            this._storage.addChild(parent, dna);
        });
        this._creatures.push(creature);
    }

    generateRandomCreatures(n) {
        this._random_creatures++;
        for (let i = 0; i < n; i++) {
            let dna = this._dna_factory.build();
            this._storage.addDna(dna);
            this.addCreature(dna);
        }
    }

    addCreature(dna) {
        let creature = new Creature(this, dna, this.randomPositionForCreature(), this._iteration_number);
        this._uploaded_creatures++;
        this._creatures.push(creature);
    }

    randomPositionForCreature() {
        let position = {};
        do {
            position = {x: Math.random() * 1600, y: Math.random() * 900};
        } while(this._collidesWithWall(position, 20));
        return position;
    }

    _collidesWithWall(point) {
        let collides = false;
        this._walls.forEach(w => {
            collides = collides || w.pointCollides(point, 20);
        });
        return collides
    }
    
    iteration() {
        ++this._iteration_number;
        this.calculateCreatureVision();
        this.iterateCreatures();
        this.removeTheDead();
        this.feedCreatures();
        this.detectBulletHits();
        this.reproduce();

        if(Math.random() < Config.instance().get('creature_creation_probability') && this._creatures.length < Config.instance().get('minimum_population_size')) {
            if(Math.random() < 0.1) {
                this.generateRandomCreatures(1);
            } else {
                let dna = this._storage.getDna();
                if (!dna) {
                    this.generateRandomCreatures(1);
                } else {
                    this._downloaded_creatures++;
                    this.addCreature(dna);
                    this._resurrected_creatures++;
                }
            }
        }

        if (this._creatures.length < Config.instance().get('overpopulation_limit') && this._food.length < Config.instance().get('maximum_amount_of_food') && Math.random() < Config.instance().get('food_generation_probability')) {
            this._food.push(new Food({x:20+Math.random()*1560,y:20+Math.random()*860}, Config.instance().get('default_food_nutrition'), 5));
        }

        setTimeout(() => { this.iteration() }, 0);
    }

    calculateCreatureVision() {
        let things = this._creatures.concat(this._food).concat(this._eggs).concat(this._bullets).concat(this._walls);
        this._creatures.forEach(creature => {
            creature.see(things);
        });
    }

    iterateCreatures() {
        this._creatures.forEach(creature => {
            creature.iterate();
            if (!creature.alive()) {
                this._food.push(new Food(creature.position(), Config.instance().get('dead_creature_nutrition'), 7));
            }
        });
    }

    removeTheDead() {
        this._creatures = this._creatures.filter(creature => {
            return creature.alive();
        });
        if (this._selected_creature != null && !this._selected_creature.alive()) {
            this._selected_creature = null;
        }
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
                    creature.feed(f);
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
                if (creature.distance(e) < 20 && creature.canTakeEgg(e)) {
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
            this.context.beginPath();
            this.context.strokeStyle = '#ff0055';
            let oldest_creature = this._creatures[0].position();
            this.context.rect(oldest_creature.x - 30, oldest_creature.y - 30,60,60);
            this.context.stroke();
        }

        if(this._selected_creature) {
            this.context.beginPath();
            this.context.strokeStyle = '#55ff00';
            let creature_position = this._selected_creature.position();
            this.context.rect(creature_position.x - 28, creature_position.y - 28,56,56);
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

