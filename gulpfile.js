'use strict';

let gulp = require('gulp'),
    batch = require('gulp-batch'),
    watch = require('gulp-watch'),
    exec = require('child_process').exec;


gulp.task('build', function(cb) {
  exec('node node_modules/browserify/bin/cmd.js js/main.js -t babelify -d -o dist/evolution.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('default', function() {
  gulp.start('build');
  gulp.src('js/hsl2rgb.js')
    .pipe(gulp.dest('dist'));
  watch('js/**/*', batch(function (events, done) {
    gulp.start('build', done);
  }));
});
