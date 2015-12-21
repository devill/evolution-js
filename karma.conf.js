'use strict';

let webpackLoaders = [ {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: ['es2015']
  }
} ];

let testPattern = 'test/client/**/*.spec.js';

let files = [
  testPattern,
  'https://cdnjs.cloudflare.com/ajax/libs/chance/0.5.6/chance.min.js'
];

let preprocessors = {};
preprocessors[testPattern] = ['webpack'];

module.exports = function(config) {
  config.set({
    captureConsole: true,
    files: files,
    port: 9876,
    browsers: ['PhantomJS'],
    frameworks: ['mocha','sinon'],
    plugins: ['karma-phantomjs-launcher','karma-mocha','karma-webpack','karma-sinon'],
    webpack: { cache: true, module: { loaders: webpackLoaders } },
    webpackMiddleware: { noInfo: true },
    preprocessors: preprocessors
  });
};
