# evolution-js
Evolving creatures in javascript

# Developer's Guide

## Prerequisites

To run the application on your own computer you will need Node.js installed.
The application uses PostgreSQL, and the project includes a Docker Compose configuration to help with spinning up a local db.

### Docker Compose

To take advantage of the attached Docker Compose configuration, to run the database, you will have to install
* docker https://docs.docker.com/engine/installation/ and
* docker-compose https://docs.docker.com/compose/install/.

## Running on your local computer

By default we use the Docker Compose service to spin up a stock PostgreSQL db, listening on port 9932.

The application will listen on port 3000.

1. $ npm install
2. $ docker-compose up -d postgres-dev
3. $ npm run patch-db
4. $ npm run watch
5. ...
6. PROFIT
7. http://127.0.0.1:3000/

## Running the tests

For the backend, the tests use a PostgreSQL database provided in a Docker Compose service.

The frontend tests use Karma and PhantomJS.

To run the tests:

1. $ npm install
2. $ docker-compose up -d postgres-test
3. $ npm run patch-db
4. $ npm test
