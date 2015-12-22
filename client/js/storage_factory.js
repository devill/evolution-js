"use strict";

let OnlineStorage = require('./online_storage');
let OfflineStorage = require('./offline_storage');

class StorageFactory {
    constructor(mode) {
        this._mode = mode
    }

    build() {
        switch (this._mode) {
            case 'online':
                return new OnlineStorage();

            case 'offline':
                let offlineStorage = new OfflineStorage();
                setInterval(() => {
                    offlineStorage.reduce();
                }, 1000);
                return offlineStorage;

            default:
                throw "Unknown storage factory mode";
        }

    }
}

module.exports = StorageFactory;