"use strict";

let World = require('./world');
let DnaFactory = require('./dna_factory');
let StorageFactory = require('./storage_factory');
let Config = require('./config');

window.config = Config.instance();

let world = new World(
    document.getElementById("main-canvas"),
    new DnaFactory(getParameterByName('type') || 'neat-reduced'),
    (new StorageFactory(getParameterByName('storage') || 'online')).build()
);
world.iteration();

setInterval(() => {
    world.drawWorld();
}, 50);

let lastIterationCount = 0;
setInterval(() => {
    let fps = world.getIterationNumber() - lastIterationCount;
    document.getElementById('stats').innerHTML =
        `Reached ${world.getIterationNumber()} at ${fps} fps<br/>` +
        `Random creatures: ${world._random_creatures}, Mated creatures: ${world._mated_creatures}, Resurrected creatures: ${world._resurrected_creatures}, Currently alive: ${world._creatures.length}`;
    lastIterationCount = world.getIterationNumber();
}, 1000);
