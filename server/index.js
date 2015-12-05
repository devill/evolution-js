'use strict';

let config = {
  port: process.env.PORT || 3000
};
let app = require('./app');
app.listen(config.port);

