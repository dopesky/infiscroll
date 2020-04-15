const {parallel, src, task, dest, watch} = require('gulp');
const browserSync = require('browser-sync').create(); // browser hot reload

const sass = require('gulp-sass'); // sass compiler and minifier
sass.compiler = require('node-sass'); // set the compiler for gulp-sass explicitly as advised in docs

const browserify = require('browserify'); // convert my commonjs syntax to browser readable
const babelify = require('babelify'); // Use babel to transform my js to es2015
const source = require('vinyl-source-stream'); // source the bundle after browserify is done working on it
const buffer = require('vinyl-buffer'); // convert the stream from source-stream to a buffer we can do minification on
const jsMinify = require('gulp-terser'); // js minifier

task('compileJS', () => {
    return browserify({
        entries: ['./node_modules/@babel/polyfill/dist/polyfill.js', './src/js/infiscroll.js'],
        transform: [babelify]
    }).bundle().pipe(source('infiscroll.js')).pipe(buffer()).pipe(jsMinify()).pipe(dest('./dist/js'))
    .pipe(browserSync.reload({stream: true}));
});

task('compileSass', () => {
    return src('./src/sass/infiscroll.scss').pipe(sass({outputStyle: 'compressed'}))
        .on('error', sass.logError).pipe(dest('./dist/css')).pipe(browserSync.reload({stream: true}));
});

task('default', () => {
    browserSync.init({proxy: 'localhost/Html/InfiScroll/docs/', baseDir: './', open: false});
    watch('./src/sass/infiscroll.scss',{ ignoreInitial: false }, parallel('compileSass'));
    watch('./src/js/infiscroll.js', { ignoreInitial: false }, parallel('compileJS'));
    watch('./docs/**/*.php').on('change', browserSync.reload);
});

task('deploy', () => {
    return browserify({
        entries: ['./node_modules/@babel/polyfill/dist/polyfill.js', './src/js/infiscroll.js'],
        transform: [babelify]
    }).bundle().pipe(source('infiscroll.js')).pipe(buffer()).pipe(jsMinify()).pipe(dest('./dist/js'))
    && src('./src/sass/infiscroll.scss').pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError).pipe(dest('./dist/css'));
});
