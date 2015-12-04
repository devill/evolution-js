"use strict";

Math.sigmoid = function(x) {
    return 1 / (1 + Math.exp(-x));
};