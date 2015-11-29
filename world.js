"use strict";

class World extends Thing {
    constructor(canvas_object) {
        super();
        this._food = [];
        this._creatures = [];
        this._eggs = [];
        this._bullets = [];
        this._iterationNumber = 0;

        this.context = canvas_object.getContext("2d");
        this.context.lineWidth = 2;
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
        let self = this;
        ++this._iterationNumber;

        this._creatures.forEach(function (creature) {
            creature.see(self._creatures.concat(self._food).concat(self._eggs).concat(self._bullets));
        });

        this._creatures.forEach(function(creature) {
            creature.iterate();
            if(!creature.alive()) {
                self._food.push(new Food(creature.position()));
            }
        });

        this._creatures = this._creatures.filter(function (creature) {
            return creature.alive();
        });

        this.feedCreatures();
        this.detectBulletHits();
        this.reproduce();
        if(this._iterationNumber % 100 == 0 && this._creatures.length < 20) {
            this.generateRandomCreatures(1);
        }

        if (this._creatures.length < 25 && Math.random() < 0.01) {
            this._food.push(new Food({x:Math.random()*1600,y:Math.random()*900}));
        }

        this.drawWorld();
        setTimeout(function() { self.iteration() }, 1);
    }

    detectBulletHits() {
        this._bullets.forEach(function(bullet) {
            bullet.iterate();
        });
        let self = this;
        this._creatures.forEach(function (creature) {
            self._bullets.forEach(function (b) {
                if (creature.distance(b) < 20) {
                    creature.takeHit();
                    b.remove();
                }
            });
        });
        this._bullets = this._bullets.filter(function (bullet) {
            return bullet.exists();
        });
    }

    feedCreatures() {
        let self = this;
        this._creatures.forEach(function (creature) {
            self._food.forEach(function (f) {
                if (creature.distance(f) < 20) {
                    creature.feed();
                    f.remove();
                }
            });
        });
        this._food = this._food.filter(function (f) {
            return f.exists();
        });
    }

    reproduce() {
        let self = this;
        this._creatures.forEach(function (creature) {
            self._eggs.forEach(function (e) {
                if (creature.distance(e) < 20) {
                    creature.takeEgg(e);
                    e.remove();
                }
            });
        });
        this._eggs = this._eggs.filter(function (e) {
            return e.exists();
        });
    }

    drawWorld() {
        let self = this;
        this.context.clearRect(0, 0, 1600, 900);
        this._eggs.forEach(function (e) {
            e.drawTo(self.context);
        });
        this._food.forEach(function (f) {
            f.drawTo(self.context);
        });
        this._bullets.forEach(function (b) {
            b.drawTo(self.context);
        });
        this._creatures.forEach(function (creature) {
            creature.drawTo(self.context, self._iterationNumber);
        });
    }

    addEgg(position, color, dna) {
        this._eggs.push(new Egg(position, color, dna))
    }

    addBullet(position, direction) {
        this._bullets.push(new Bullet(position, direction))
    }
}