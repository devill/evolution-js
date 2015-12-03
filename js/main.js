"use strict";

let World = require('./world');

let world = new World(document.getElementById("main-canvas"));
world.iteration();

setInterval(() => {
    world.drawWorld();
}, 50);

let lastIterationCount = 0;
setInterval(() => {
    let fps = world._iterationNumber - lastIterationCount;
    document.getElementById('stats').innerHTML = `Reached ${world._iterationNumber} at ${fps} fps`;
    lastIterationCount = world._iterationNumber;
}, 1000);