"use strict";

class Matrix {
    constructor(data) {
        this._data = data;
    }

    multiplyWithVector(vector) {
        let result = [];
        for(let i = 0; i < this._data.length; ++i) {
            let k = 0;
            for(let j = 0; j < this._data[i].length; ++j ) {
                k += vector[j] * this._data[i][j];
            }
            result.push(k);
        }
        return result;
    }

    mix(other) {
        let result = [];
        for(let i = 0; i < this._data.length; ++i) {
            var rnd = Math.random();
            let r = [];
            if(rnd < 0.2) {
                let cut = Math.floor(Math.random() * this._data[i].length);
                r = this._data[i].slice(0,cut).concat(other._data[i].slice(cut,other._data[i].length))
            } else {
                r = (rnd < 0.6 ? this._data[i] : other._data[i]);
            }
            result.push(r);
        }
        return new Matrix(result);
    }

    mutate(p) {
        if (Math.random() > p) { return this; }
        let i = Math.floor(Math.random()*this._data.length);
        let j = Math.floor(Math.random()*this._data[i].length);
        this._data[i][j] += Math.random()*0.01-1;
        return this;
    }

    static random(rows, cols) {
        let result = [];
        for(let i = 0; i < rows; ++i) {
            let v = [];
            for(let j = 0; j < cols; ++j) {
                v.push(2*Math.random()-1);
            }
            result.push(v);
        }
        return new Matrix(result);
    }

    static randomDiagonal(rows, cols) {
        let result = [];
        for(let i = 0; i < rows; ++i) {
            let v = [];
            for(let j = 0; j < cols; ++j) {
                v.push(0);
            }
            result.push(v);
        }
        for(let j = 0; j < cols; ++j) {
            result[Math.floor(j*rows/cols)][j] = 2*Math.random()-1;
        }

        return new Matrix(result);
    }
}

module.exports = Matrix;