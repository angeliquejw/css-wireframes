// Include dependencies
var
    gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),
    cssBase64 = require('gulp-css-base64'),
    minify = require('gulp-minify'),
    plugins = require('gulp-load-plugins')(),
    postcss = require('gulp-postcss'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

// Default task
gulp.task('default', function () {});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: "./dist"
    });
});

gulp.task('reload', function (done) {
    browserSync.reload();
    done();
});

// Monitor changes on files and launch various tasks
gulp.task('watch', function () {
    // CSS stuff
    gulp.watch('./src/**/*.scss', gulp.series('sass', 'autoprefixer', 'base64', 'minify-css', 'sourcemaps', 'reload'));
    // Javascript stuff
    gulp.watch('./src/javascript/*.js', gulp.series('minify-js', 'reload'));
    // Fontello
    gulp.watch('./src/config.json', gulp.series('fontello-import', 'fontello-deploy'));
    // Markup
    gulp.watch('./dist/*.html', gulp.series('reload'));
});

// Compile the main Sass file to CSS
gulp.task('sass', function () {
    return gulp.src('./src/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

// Add vendor prefixes to the compiled CSS file
gulp.task('autoprefixer', function () {
    return gulp.src('./dist/css/*.css')
        .pipe(postcss(
            [autoprefixer()]
        ))
        .pipe(gulp.dest('./dist/css'));
});

// Converts all data found within a stylesheet into base64-encoded data URI strings
gulp.task('base64', function () {
    return gulp.src('./dist/css/wireframes.css')
        .pipe(cssBase64({
            maxWeightResource: 131072,
            //baseDir: "./src" // doesn't seem to work ?
        }))
        .pipe(gulp.dest('./dist/css'));
});

// Minify the compiled CSS file in a new .min.css file
gulp.task('minify-css', function () {
    return gulp.src('./dist/css/wireframes.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('./dist/css'));
});

// Minify the JS file in a new .min.js file
gulp.task('minify-js', function () {
    return gulp.src('./src/javascript/*.js')
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('./dist/javascript'));
});

// Create sourcemaps for the compiled CSS
gulp.task('sourcemaps', function () {
    return gulp.src('./dist/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'));
});

// Import fontello SVG and CSS files in a temp directory from the config.json
gulp.task('fontello-import', function () {
    return gulp.src('./src/config.json')
        .pipe(plugins.fontello({
            font: 'font', // Destination dir for Fonts and Glyphs
            css: 'css' // Destination dir for CSS Styles
        }))
        //.pipe(plugins.print())
        .pipe(gulp.dest('./src/fontello_tmp'));
});

// Move selected fontello files from the temp directory to the working directory
// FIXME : In the CSS the path is wrong, and we don't need svg, ttf and eot versions.
gulp.task('fontello-deploy', function (done) {
    gulp.src("./src/fontello_tmp/font/fontello.woff")
        //.pipe(rename("fontello.woff"))
        .pipe(gulp.dest('./src/fonts'));
    gulp.src("./src/fontello_tmp/font/fontello.woff2")
        //.pipe(rename("fontello.woff2"))
        .pipe(gulp.dest('./src/fonts'));
    gulp.src("./src/fontello_tmp/css/fontello.css")
        .pipe(rename("_fontello.scss"))
        .pipe(gulp.dest('./src'));
    gulp.src('./src/fontello_tmp', {
            read: false
        })
        .pipe(clean());
    done();
});

// Go go go !
gulp.task('default', gulp.parallel('browser-sync', 'watch'));