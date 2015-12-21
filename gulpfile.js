'use strict';

let gulp = require('gulp'),
    webpack = require('webpack'),
    child = require('child_process');

let env = Object.assign({ PORT: 3000 }, process.env);
let config = { cwd: './', env: env };
let server;

let webpackLoaders = [ {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    presets: ['es2015']
  }
} ];
let webpackConfig = {
  cache: true,
  entry: { app: './client/js/main.js' },
  module: {
    loaders: webpackLoaders
  },
  devtool: 'inline-source-map',
  output: { filename: 'dist/js/evolution.js' }
};

gulp.task('build-client', function(cb) {
  gulp.src('client/js/hsl2rgb.js').pipe(gulp.dest('dist/js'));
  gulp.src('client/js/js_ext.js').pipe(gulp.dest('dist/js'));
  gulp.src('node_modules/vis/dist/*').pipe(gulp.dest('dist/js/vis'));
  gulp.src('client/index.html').pipe(gulp.dest('dist'));
  webpack(webpackConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    cb();
  });
});

gulp.task('test-client', function(done) {
  var KarmaServer = require('karma').Server;

  var server = new KarmaServer({
    configFile: process.cwd() + '/karma.conf.js',
    singleRun: true
  }, done);
  server.start();
}),

gulp.task('start-server', function(done) {
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
  gulp.start('start-server');
  gulp.start('build-client');
  gulp.watch(['client/**/*', 'server/**/*'], ['start-server', 'build-client']);
});

gulp.task('build', ['build-client']);

