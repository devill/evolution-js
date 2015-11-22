"use strict";

$(document).ready(function() {

    let creatures = [];
    for(let i = 0; i < 100; i++) {
        creatures.unshift(new Creature({x:Math.random()*1600,y:Math.random()*900}));
    }

    let food = [];
    for(let i = 0; i < 100; i++) {
        food.unshift(new Food({x:Math.random()*1600,y:Math.random()*900}));
    }

    let ctx = document.getElementById("main-canvas").getContext("2d");

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

    function iteration() {
        creatures.forEach(function(creature) {
            creature.iterate();
            if(!creature.alive()) {
                food.unshift(new Food(creature.position()));
            }
        });
        creatures = creatures.filter(function (creature) {
            return creature.alive();
        });
        feedCreatures();
        if (Math.random() < 0.01) {
            food.unshift(new Food({x:Math.random()*1600,y:Math.random()*900}));
        }

        ctx.clearRect(0,0,1600,900);
        creatures.forEach(function(creature) { creature.drawTo(ctx); });
        food.forEach(function(f) { f.drawTo(ctx); });
    }

    setInterval(iteration,1);
});