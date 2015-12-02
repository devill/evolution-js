'use strict';

let gulp = require('gulp'),
    batch = require('gulp-batch'),
    watch = require('gulp-watch'),
    webpack = require('webpack');

let webpackConfig = {
  entry: { app: './js/main.js' },
  module: {
    loaders: [ { test: /\.js$/, exclude: /node_modules/, loader: 'babel' } ]
  },
  devtool: 'inline-source-map',
  output: { filename: 'dist/evolution.js' }
};

gulp.task('build', function(cb) {
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    cb();
  });
});

gulp.task('default', function() {
  gulp.src('js/hsl2rgb.js')
    .pipe(gulp.dest('dist'));

  gulp.start('build');
  watch('js/**/*', batch(function (events, done) {
    gulp.start('build', done);
  }));
});

