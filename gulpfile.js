'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();
const AUTOPREFIXER_BROWSERS = [
  //
  // follows bootstrap's
  // official browser support policy:
  // https://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
  //
  'Chrome >= 35',
  'Firefox >= 38',
  'Edge >= 12',
  'Explorer >= 10',
  'iOS >= 8',
  'Safari >= 8',
  'Android 2.3',
  'Android >= 4',
  'Opera >= 12'
];

// css
// - compile sass to css
// - prefix css
// - minify css
// - output: *.css, *.min.css
gulp.task('css', function() {
  return gulp.src('assets/scss/*.s+(a|c)ss')
    // .pipe($.sourcemaps.init())
    .pipe($.sass({outputStyle: 'expanded', precision: 10}).on('error', $.sass.logError))
    // .pipe($.sourcemaps.write())  // Write sourcemap inline
    // .pipe($.sourcemaps.init({loaMaps: true}))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    // .pipe($.size({title: 'sass', showFiles: true}))
    // .pipe($.sourcemaps.write('.'))
    .pipe($.rename({dirname: ''}))
    .pipe(gulp.dest('assets/css'))
    .pipe($.cssnano())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest('assets/css'));
});


// Serve and watch
// - run browser sync server
// - watch files
gulp.task('server', ['css'], function () {
  browserSync.init({
    server: {
      baseDir: ['_gh_pages'],
      index: ''
    },
    files: ['**/*.+(css|js|html)'], // files injected, not reloaded
    port: 3000,
    open: false,
    reloadOnRestart: true
  });

  gulp.watch(['assets/scss/*.s+(a|c)ss'], ['css']);
});

// The default task, build and serve
gulp.task('default', ['server']);