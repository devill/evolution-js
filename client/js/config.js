"use strict";

let config_instance = null;

class Config {
    constructor() {
        this.values  = {};
    }

    static instance() {
        if (!config_instance) {
            config_instance = new Config();
        }
        return config_instance;
    }

    get(key) {
        return this.values[key];
    }

    set(key, value) {
        this.values[key] = value;
        return this;
    }

    setIfNull(key, value) {
        if(!this.get(key)) {
            this.set(key, value);
        }
        return this;
    }

    list() {
        return this.values;
    }

    report() {
        let keys = Object.keys(this.values).sort();
        return keys.map(key => { return `${key} = ${this.values[key]}`; }).join('\n');
    }
}

module.exports = Config;