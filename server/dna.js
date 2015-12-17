"use strict";

let pg = require('co-pg')(require('pg'));

let storedDna;
let connectionString = process.env.DATABASE_URL || 'postgres://postgres_user:postgres_pw@localhost:9932/postgres_db';

function* store() {
  let client = new pg.Client(connectionString);
  yield client.connectPromise();
  let result = yield client.queryPromise('INSERT INTO dna (dna) VALUES ($1) RETURNING id', [this.request.body]);
  client.end();

  let id = result.rows[0].id;
  storedDna = this.request.body;
  this.redirect(`/dna/${id}/`);
}

function* load(id) {
  let client = new pg.Client(connectionString);
  yield client.connectPromise();
  let result = yield client.queryPromise('SELECT * FROM dna WHERE id = $1', [id]);
  client.end();

  this.body = JSON.parse(result.rows[0].dna);
}

function* random() {
  let client = new pg.Client(connectionString);
  yield client.connectPromise();
  let result = yield client.queryPromise('SELECT id, random() as r FROM dna ORDER BY r LIMIT 1');
  let id = result.rows[0].id;
  this.redirect(`/dna/${id}/`);
}

module.exports = {
  store: store,
  load: load,
  random: random
};

