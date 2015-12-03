"use strict";

let World = require('./world');

let world = new World(document.getElementById("main-canvas"));
world.iteration();

setInterval(() => {
    world.drawWorld();
}, 50);

let lastIterationCount = 0;
setInterval(() => {
    let fps = world.getIterationNumber() - lastIterationCount;
    document.getElementById('stats').innerHTML = `Reached ${world.getIterationNumber()} at ${fps} fps`;
    lastIterationCount = world.getIterationNumber();
}, 1000);