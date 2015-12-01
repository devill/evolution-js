"use strict";

class Thing {
    _visibilityData(position, direction) {
        let rx = this._position['x'] - position['x'];
        let ry = this._position['y'] - position['y'];

        let nx = rx * Math.cos(-direction) - ry * Math.sin(-direction);
        let ny = rx * Math.sin(-direction) + ry * Math.cos(-direction);

        return {distanceFromEye: nx, distanceFromLineOfSight: Math.abs(ny) };
    }
}

module.exports = Thing;

