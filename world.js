"use strict";

class World extends Thing {
    constructor(canvas_object) {
        super();
        this._food = [];
        this._creatures = [];
        this._eggs = [];
        this._iterationNumber = 0;

        this.context = canvas_object.getContext("2d");
        this.context.lineWidth = 2;
    }

    injectCreature(dna) {
        var creature = new Creature(this, {x: Math.random() * 1600, y: Math.random() * 900}, this._iterationNumber);
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
            creature.see(self._creatures.concat(self._food));
        });

        this._creatures.forEach(function(creature) {
            creature.iterate();
            if(!creature.alive()) {
                self._food.push(new Food(creature.position()));
                self.generateRandomCreatures(1);
            }
        });

        this._creatures = this._creatures.filter(function (creature) {
            return creature.alive();
        });

        this.feedCreatures();

        if (Math.random() < 0.01) {
            this._food.push(new Food({x:Math.random()*1600,y:Math.random()*900}));
        }

        this.drawWorld();
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

    drawWorld() {
        let self = this;
        this.context.clearRect(0, 0, 1600, 900);
        this._creatures.forEach(function (creature) {
            creature.drawTo(self.context, self._iterationNumber);
        });
        this._food.forEach(function (f) {
            f.drawTo(self.context);
        });
        this._eggs.forEach(function (e) {
            e.drawTo(self.context);
        });
    }

    addEgg(position, color) {
        console.log('Lay egg', position, color);
        this._eggs.push(new Egg(position, color))
    }
}