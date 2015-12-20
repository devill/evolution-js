"use strict";

let World = require('./world');
let DnaFactory = require('./dna_factory');
let OfflineStorage = require('./online_storage');
let Config = require('./config');

window.config = Config.instance();

let offlineStorage = new OfflineStorage();
let world = new World(document.getElementById("main-canvas"), new DnaFactory(getParameterByName('type') || 'simple_reduced'), offlineStorage);
world.iteration();

setInterval(() => {
    world.drawWorld();
}, 50);

//setInterval(() => {
//    offlineStorage.reduce();
//}, 100);

let lastIterationCount = 0;
setInterval(() => {
    let fps = world.getIterationNumber() - lastIterationCount;
    document.getElementById('stats').innerHTML =
        `Reached ${world.getIterationNumber()} at ${fps} fps<br/>` +
        `Random creatures: ${world._random_creatures}, Mated creatures: ${world._mated_creatures}, Resurrected creatures: ${world._resurrected_creatures}, Currently alive: ${world._creatures.length}`;
    lastIterationCount = world.getIterationNumber();
}, 1000);
