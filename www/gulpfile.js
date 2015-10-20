var gulp = require("gulp");

var concat = require("gulp-concat");
var del = require("del");
var jshint = require("gulp-jshint");
var rename = require("gulp-rename");
var rimraf = require("gulp-rimraf");
var uglify = require("gulp-uglify");

gulp.task("clean", function() {
  return del(["./app/scripts.js"]);
});

gulp.task("scripts", ["clean"], function() {
  gulp.src("./app/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    //.pipe(concat("scripts.min.js"))
    //.pipe(uglify())
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("./app/"));
});

gulp.task("default", ["scripts"]);