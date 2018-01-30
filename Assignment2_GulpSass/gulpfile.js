const gulp = require('gulp');
const concatenate = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const gulpSASS = require('gulp-sass');
const rename = require('gulp-rename');

const sassFiles = ['./src/scss/*'],
  imgFiles = ['./src/img/*'],
  jsFiles = ['./src/js/*'],
  vendorJsFiles = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/popper.js/dist/popper.js.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js'
  ];

gulp.task('sass', () => {
  gulp
    .src(sassFiles)
    .pipe(gulpSASS())
    .pipe(concatenate('styles.css'))
    .pipe(gulp.dest('./public/css/'))
    .pipe(
      autoPrefix({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(cleanCSS())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('js:vendor', () => {
  gulp
    .src(vendorJsFiles)
    .pipe(concatenate('vendor.min.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('js:custom', () => {
  gulp
    .src(jsFiles)
    .pipe(concatenate('js.min.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('img', () => {
  gulp.src(imgFiles).pipe(gulp.dest('./public/img/'));
});

gulp.task('build', ['sass', 'js:vendor', 'js:custom', 'img']);

gulp.task('watch', () => {
  gulp.watch(sassFiles, ['sass']);
  gulp.watch(jsFiles, ['js:custom']);
  gulp.watch(imgFiles, ['img']);
});

gulp.task('default', ['watch']);
