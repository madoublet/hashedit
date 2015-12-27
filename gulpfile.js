var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var minify = require('gulp-minify');

// concat js
gulp.task('js', function() {
  return gulp.src(['bower_components/dropzone/dist/min/dropzone.min.js', 'bower_components/Sortable/Sortable.min.js', 'bower_components/fetch/fetch.js', 'bower_components/moment/min/moment.min.js', 'js/hashedit.js', 'js/hashedit.app.js'])
    .pipe(concat('hashedit.js'))
    .pipe(minify({
        exclude: ['tasks'],
        ignoreFiles: ['.min.js', '-min.js']
    }))
    .pipe(gulp.dest('dist/'));
});

// concat css
gulp.task('css', function() {
  return gulp.src(['css/hashedit.app.css', 'css/hashedit.css', 'bower_components/dropzone/dist/min/dropzone.min.css'])
    .pipe(concat('hashedit.css'))
    .pipe(gulp.dest('dist/'))
    .pipe(minifyCss())
    .pipe(rename('hashedit-min.css'))
    .pipe(gulp.dest('dist/'));
});


gulp.task('default', ['js', 'css']);