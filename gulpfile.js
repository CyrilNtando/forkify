const gulp = require('gulp');
const wait = require('gulp-wait');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
/*********SASS TASK****** */
gulp.task('sass', () =>
  gulp
    .src('./src/sass/main.scss')
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ Browserslist: ['last 2 versions'], cascade: false, grip: 'no-autoplace' }))
    .pipe(gulp.dest('./build/css/'))
);
/*********END OF SASS TASK****** */

/*********JAVASCRIPT TASK****** */
gulp.task('script', () =>
  gulp
    .src('./src/js/')
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('./build/js/'))
);
/*********END OF JAVASCRIPT TASK****** */

/*********WATCH FILES CHANGES****** */
gulp.task('watch', () => {
  //min server or browser Sync
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  });
  //watch html file and reload browser
  watch('./build/index.html', () => {
    browserSync.reload();
  });
  //watch sass files changes then exec cssInject Task
  watch('./src/sass/**/*.scss', gulp.series('cssInject'));
  //exec scriptInject if js files are modified
  watch('./src/js/**/*.js', gulp.series('scriptInject'));
});
/********* END OF WATCH FILES CHANGES****** */

/*********ENJECT FILE TO BROWSER****** */
//exec sass-task then
//inject css styles to the browser
gulp.task(
  'cssInject',
  gulp.series('sass', () => gulp.src('./build/css/main.css').pipe(browserSync.stream()))
);

//calls script then reload browser
gulp.task(
  'scriptInject',
  gulp.series('script', () => {
    browserSync.reload();
  })
);
/********* END OF ENJECT FILE TO BROWSER****** */
