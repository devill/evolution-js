"use strict";

$(document).ready(function() {
    let world = new World(document.getElementById("main-canvas"));
    world.generateRandomCreatures(20);
    setInterval(function() { world.iteration(); },1);
});
