"use strict";

let World = require('./world');

let world = new World(document.getElementById("main-canvas"));
world.iteration();
