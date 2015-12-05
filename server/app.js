'use strict';

let koa = require('koa'),
    logger = require('koa-logger'),
    route = require('koa-route'),
    serve = require('koa-static'),
    dna = require('./dna');

let app = koa();
app.use(logger());
app.use(route.get('/random-dna/', dna.generator));
app.use(route.get('/dna/', dna.load));
app.use(route.post('/dna/', dna.store));
app.use(serve('dist'));

module.exports = app;

