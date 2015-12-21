'use strict';

let koa = require('koa'),
    bodyparser = require('koa-bodyparser'),
    logger = require('koa-logger'),
    route = require('koa-route'),
    serve = require('koa-static'),
    dna = require('./dna');

let app = koa();
app.use(logger());
app.use(serve('dist'));

app.use(route.get('/dna/random/', dna.random));
app.use(route.get('/dna/:id/', dna.load));

app.use(bodyparser());
app.use(route.put('/dna/:id/', dna.store));
app.use(route.patch('/dna/:id/', dna.update));

module.exports = app;

