"use strict";

class Thing {
    _visibilityData(position, direction) {
        let rx = this._position['x'] - position['x'];
        let ry = this._position['y'] - position['y'];

        let nx = rx * Math.cos(-direction) - ry * Math.sin(-direction);
        let ny = rx * Math.sin(-direction) + ry * Math.cos(-direction);

        return {distanceFromEye: nx, distanceFromLineOfSight: Math.abs(ny) };
    }


    visible(position, direction) {
        var visibilityData = this._visibilityData(position, direction);
        return visibilityData['distanceFromEye'] > 0 && visibilityData['distanceFromLineOfSight'] < this.radius();
    }

    visibilityDistance(position, direction) {
        var visibilityData = this._visibilityData(position, direction);
        return visibilityData['distanceFromEye'];
    }
}

module.exports = Thing;

