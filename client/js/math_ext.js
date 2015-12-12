"use strict";

Math.sigmoid = function(x) {
    return 1 / (1 + Math.exp(-x));
};

Math.uuid = function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

Math.normal = function (di) {
    var d = di || 5;
    return (Array.apply(null, new Array(2*d)).map(function(c) { return Math.random(); }).reduce(function(s,x) { return s+x}) - d) / d;
};

Math.bimodal_normal = function (di) {
    return (Math.random() < 0.5 ? 0 : 1) + Math.normal(di);
};

function isInt(value) {
    var x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

Array.prototype.unique = function() {
    var seen = {};
    return this.filter(function(item) {
        var shouldKeep = !seen[item];
        seen[item] = true;
        return shouldKeep;
    });
};