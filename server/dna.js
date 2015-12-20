"use strict";

let pg = require('pg');
let pgp = require('pg-promise')();

let connectionString = process.env.DATABASE_URL || 'postgres://postgres_user:postgres_pw@localhost:9932/postgres_db';
let db = pgp(connectionString);

function* store() {
  let data = this.request.body;
  let store = (data.mother && data.father) ? withParents : withoutParents;
  yield store(data)
    .then((data) => {
      this.redirect(`/dna/${data.id}/`);
    })
    .catch(error => {
      console.log(error);
    });
}

function withoutParents(data) {
  return db.one('INSERT INTO dna (id, dna) VALUES ($1, $2) RETURNING id', [data.id, data]);
}

function withParents(data) {
  return db.one('INSERT INTO dna (id, father, mother, dna) VALUES ($1, $2, $3, $4) RETURNING id', [data.id, data.father, data.mother, data]);
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

