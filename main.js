"use strict";

$(document).ready(function() {

    let creatures = [];
    let iterationNumber = 0;
    generateRandomCreatures(20, iterationNumber);
    let food = [];

    let ctx = document.getElementById("main-canvas").getContext("2d");
    ctx.lineWidth = 2;

    function generateRandomCreatures(n, iterationNumber) {
        for (let i = 0; i < n; i++) {
            var creature = new Creature({x: Math.random() * 1600, y: Math.random() * 900}, iterationNumber);
            creature.generateRandomDna();
            creatures.push(creature);
        }
    }

    function iteration() {
        ++iterationNumber;

        function feedCreatures() {
            creatures.forEach(function (creature) {
                food.forEach(function (f) {
                    if (creature.distance(f) < 20) {
                        creature.feed();
                        f.remove();
                    }
                });
            });
            food = food.filter(function (f) {
                return f.exists();
            });
        }

        function drawWorld() {
            ctx.clearRect(0, 0, 1600, 900);
            creatures.forEach(function (creature) {
                creature.drawTo(ctx, iterationNumber);
            });
            food.forEach(function (f) {
                f.drawTo(ctx);
            });
        }

        creatures.forEach(function (creature) {
            creature.see(creatures.concat(food));
        });

        creatures.forEach(function(creature) {
            creature.iterate();
            if(!creature.alive()) {
                food.push(new Food(creature.position()));
                generateRandomCreatures(1, iterationNumber);
            }
        });

        creatures = creatures.filter(function (creature) {
            return creature.alive();
        });

        feedCreatures();

        if (Math.random() < 0.01) {
            food.push(new Food({x:Math.random()*1600,y:Math.random()*900}));
        }

        drawWorld();
    }

    setInterval(iteration,1);
});
