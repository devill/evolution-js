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

Math.bimodal_normal = function () {
    return (Math.random() < 0.5 ? 0 : 1) + chance.normal();
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

Object.values = function(self) {
    return Object.keys(self).map(function(key) { return self[key]; });
};