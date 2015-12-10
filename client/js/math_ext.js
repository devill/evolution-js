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

Math.bimodal_normal = function (di) {
    let d = di || 5;
    return (Math.random() < 0.5 ? 0 : 1) + (Array.apply(null, new Array(2*d)).map(function(c) { return Math.random(); }).reduce(function(s,x) { return s+x}) - d) / d;
}