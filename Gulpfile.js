var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var debug = require('gulp-debug');

var SCRIPTS_FOLDER = './app/front/scripts/';
var SCRIPTS_LIB_FOLDER = SCRIPTS_FOLDER + 'lib/';
var CRISPYPEAR_FOLDER = SCRIPTS_LIB_FOLDER + 'CrispyPear/';
var STYLES_FOLDER = './app/front/styles/';

var BUILD_FOLDER = './public/build/';

function swallowError(err) {
  console.error('Error:', err.message);
  this.emit('end');
}

gulp.task('default', ['sass', 'js', 'watch']);


//=====================//
//======= WATCH =======//
//=====================//


gulp.task('watch', function() {
  gulp.watch(SCRIPTS_FOLDER + '**/*.js', ['js']);
  gulp.watch(STYLES_FOLDER + '**/*.scss', ['sass']);
});


//=====================//
//======== CSS ========//
//=====================//

gulp.task('sass', function() {
  gulp.src(STYLES_FOLDER + 'style.scss')
    .pipe(sass()).on('error', swallowError)
    .pipe(cssmin())
    .pipe(gulp.dest(BUILD_FOLDER));
});


//=====================//
//========= JS ========//
//=====================//

gulp.task('js', function() {
  gulp.src([SCRIPTS_LIB_FOLDER + '*.js', SCRIPTS_FOLDER + 'scenes/*.js', SCRIPTS_FOLDER + '*.js'])
    .pipe(concat('app.js', {newLine: ';'})).on('error', swallowError)
    .pipe(gulp.dest(BUILD_FOLDER));
});


//=====================//
//==== Crispy pear ====//
//=====================//

function format(fileName) {
  return CRISPYPEAR_FOLDER + fileName;
}

// Files for crispypear.js, in order.
var cpFiles = [
  format('lib/PxLoader-min.js'), format('CPUtils.js'), format('CPDisplayObject.js'),
  format('CPImage.js'), format('CPSprite.js'), format('CPText.js'), format('CPDisplayGroup.js'),
  format('CPButton.js'), format('CPActionCanvas.js'), format('CPSceneManager.js'),
  format('CPResourceManager.js'), format('CPGame.js'), format('CPLayer.js'),
  format('CPScene.js')
];
gulp.task('crispypear', function() {
  gulp.src(cpFiles)
    .pipe(concat('crispypear.js')).on('error', swallowError)
    .pipe(gulp.dest(SCRIPTS_LIB_FOLDER));
});