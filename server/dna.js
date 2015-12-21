"use strict";

let pg = require('pg');
let pgp = require('pg-promise')();

let connectionString = process.env.DATABASE_URL || 'postgres://postgres_user:postgres_pw@localhost:9932/postgres_db';
let db = pgp(connectionString);

function* store(id) {
  let data = this.request.body;
  if (id != data.id) { this.status = 400; return; }
  let store = (data.mother && data.father) ? withParents : withoutParents;
  yield store(data)
    .then((data) => {
      this.status = 201;
      this.set('Location', `/dna/${id}/`);
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

function* update(id) {
  let data = this.request.body;
  if (data.operator != '+' || data.field != 'lives') { this.status = 501; return; }

  yield db.none('UPDATE dna SET lives = lives + 1 WHERE id = $1', [id])
    .then(() => {
      this.body = {};
    })
    .catch(error => { console.log(error); });
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
  update: update,
  load: load,
  random: random
};

