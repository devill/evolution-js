"use strict";

Math.sigmoid = function(x) {
    return 1 / (1 + Math.exp(-x));
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
