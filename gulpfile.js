'use strict';

let gulp = require('gulp'),
    webpack = require('webpack'),
    child = require('child_process');

let env = Object.assign({ PORT: 3000 }, process.env);
let config = { cwd: './', env: env };
let server;

let webpackConfig = {
  entry: { app: './client/js/main.js' },
  module: {
    loaders: [ { test: /\.js$/, exclude: /node_modules/, loader: 'babel' } ]
  },
  devtool: 'inline-source-map',
  output: { filename: 'dist/js/evolution.js' }
};

gulp.task('buildClient', function(cb) {
  gulp.src('client/js/hsl2rgb.js').pipe(gulp.dest('dist/js'));
  gulp.src('client/js/math_ext.js').pipe(gulp.dest('dist/js'));
  gulp.src('node_modules/vis/dist/*').pipe(gulp.dest('dist/js/vis'));
  gulp.src('client/index.html').pipe(gulp.dest('dist'));
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    cb();
  });
});

gulp.task('startServer', function(done) {
  if (server && server.kill) {
    server.kill();
  }
  server = child.spawn('node', ['server/index.js'], config);
  server.stdout.on('data', function(data) {
      console.log('' + data);
  });
  server.stderr.on('data', function(data) {
      console.log('' + data);
  });
  done();
});

gulp.task('default', function() {
  gulp.start('startServer');
  gulp.start('buildClient');
  gulp.watch(['client/**/*', 'server/**/*'], ['startServer', 'buildClient']);
});

