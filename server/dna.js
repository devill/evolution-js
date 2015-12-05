"use strict";

let mid_layer_size = 20;
let sight_resolution = 7;

function randomMatrix(rows, cols) {
  let result = [];
  for(let i = 0; i < rows; ++i) {
    let v = [];
    for(let j = 0; j < cols; ++j) {
      v.push(2*Math.random()-1);
    }
    result.push(v);
  }
  return result;
}

function* generate() {
  this.body = {
    first_layer: randomMatrix(mid_layer_size, sight_resolution*4+3),
    second_layer: randomMatrix(4, mid_layer_size),
    egg_color: Math.random() * 360,
    color: Math.random() * 360,
    eye_size: (0.17 + 0.1*Math.random())*Math.PI
  };
}

module.exports = {
  generator: generate
};

