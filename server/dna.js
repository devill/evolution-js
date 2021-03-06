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
  return db.one('INSERT INTO dna (id, dna) VALUES (${id}, ${this}) RETURNING id', data);
}

function withParents(data) {
  return db.one('INSERT INTO dna (id, father, mother, dna) VALUES (${id}, ${father}, ${mother}, ${this}) RETURNING id', data);
}

function* update(id) {
  let data = this.request.body;
  if (data.operator != '+' || data.field != 'lives') { this.status = 501; return; }

  yield db.none('UPDATE dna SET lives = lives + 1 WHERE id = ${id}', { id: id })
    .then(() => {
      this.body = {};
    })
    .catch(error => { console.log(error); });
}

function* load(id) {
  yield db.one('SELECT * FROM dna WHERE id = ${id}', { id: id })
    .then((data) => {
      this.body = JSON.parse(data.dna);
    })
    .catch(error => {
      console.log(error);
    });
}

let fitSql = `
SELECT id, cast((children + grandchildren) as float) / lives as fitness, random() as r
FROM (
  SELECT parent.id, parent.lives,
    COUNT(DISTINCT child.id) as children, COUNT(DISTINCT grandchild.id) as grandchildren
  FROM dna parent
  LEFT JOIN dna child ON child.mother = parent.id OR child.father = parent.id
  LEFT JOIN dna grandchild ON grandchild.mother = child.id OR grandchild.father = child.id
  GROUP BY parent.id
) parent
ORDER BY fitness desc, r
LIMIT 1
OFFSET floor(random() * LEAST(200, (SELECT COUNT(*) FROM dna)))
`;

function* random() {
  let randomId = yield db.one(fitSql)
    .then((data) => {
      return data.id;
    })
    .catch(error => {
      console.log(error);
    });

  this.redirect(`/dna/${randomId}/`);
}

module.exports = {
  store: store,
  update: update,
  load: load,
  random: random
};

