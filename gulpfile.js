/*
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

// concat js
gulp.task('js', function() {
  return gulp.src('hashedit/js/*.js')
    .pipe(concat('hashedit.min.js'))
    .pipe(gulp.dest('hashedit/'));
});

// concat css
gulp.task('css', function() {
  return gulp.src('css/*.css')
    .pipe(concat('hashedit.css'))
    .pipe(gulp.dest('hashedit/'))
    .pipe(minifyCss())
    .pipe(rename('hashedit.min.css'))
    .pipe(gulp.dest('hashedit/'));
});


gulp.task('default', ['js', 'css']);

*/