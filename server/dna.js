"use strict";

let pg = require('pg');
let pgp = require('pg-promise')();

let connectionString = process.env.DATABASE_URL || 'postgres://postgres_user:postgres_pw@localhost:9932/postgres_db';
let db = pgp(connectionString);

function* store() {
  yield db.one('INSERT INTO dna (dna) VALUES ($1) RETURNING id', [this.request.body])
    .then((data) => {
      this.redirect(`/dna/${data.id}/`);
    })
    .catch(error => {
      console.log(error);
    });
}

function* load(id) {
  yield db.one('SELECT * FROM dna WHERE id = $1', [id])
    .then((data) => {
      this.body = JSON.parse(data.dna);
    })
    .catch(error => {
      console.log(error);
    });
}

function* random() {
  yield db.one('SELECT id, random() as r FROM dna ORDER BY r LIMIT 1')
    .then((data) => {
      this.redirect(`/dna/${data.id}/`);
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports = {
  store: store,
  load: load,
  random: random
};

