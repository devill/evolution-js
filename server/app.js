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

app.use(route.get('/random-dna/', dna.generator));
app.use(route.get('/dna/:id', dna.load));

app.use(bodyparser());
app.use(route.post('/dna/', dna.store));

module.exports = app;

