"use strict";

let World = require('./world');
let DnaFactory = require('./dna_factory');
let OfflineStorage = require('./offline_storage');

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let offlineStorage = new OfflineStorage();
let world = new World(document.getElementById("main-canvas"), new DnaFactory(getParameterByName('type') || 'simple_reduced'), offlineStorage);
world.iteration();

setInterval(() => {
    world.drawWorld();
}, 50);

setInterval(() => {
    offlineStorage.reduce();
}, 60000);

let lastIterationCount = 0;
setInterval(() => {
    let fps = world.getIterationNumber() - lastIterationCount;
    document.getElementById('stats').innerHTML =
        `Reached ${world.getIterationNumber()} at ${fps} fps<br/>` +
        `Random creatures: ${world._random_creatures}, Mated creatures: ${world._mated_creatures}, Currently alive: ${world._creatures.length}`;
    lastIterationCount = world.getIterationNumber();
}, 1000);