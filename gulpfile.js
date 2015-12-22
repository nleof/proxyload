var exec = require('child_process').exec;

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');

var src = 'proxyload.js';

gulp.task('tests', function (callback) {
    exec('npm test', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        callback(err);
    });
});

gulp.task('jshint', function () {
    return gulp.src(src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('minify', function () {
    return gulp.src(src)
        .pipe(uglify())
        .pipe(rename('proxyload.min.js'))
        .pipe(gulp.dest('./'))
        .pipe(gulp.dest('./tests/'));
});

gulp.task('watch', function () {
    gulp.watch([src, 'tests/*.js'], ['default']);
});

gulp.task('default', ['tests', 'jshint', 'minify'], function() {
    console.log('Done');
});
