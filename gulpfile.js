const {parallel, src, task, dest, watch} = require('gulp');
const browserSync = require('browser-sync').create(); // browser hot reload

const sass = require('gulp-sass')(require('node-sass')); // sass compiler and minifier

const browserify = require('browserify'); // convert my module syntax to browser readable
const babelify = require('babelify'); // Use babel to transform my js to es2015
const source = require('vinyl-source-stream'); // source the bundle after browserify is done working on it
const buffer = require('vinyl-buffer'); // convert the stream from source-stream to a buffer we can do minification on
const jsMinify = require('gulp-terser'); // js minifier

const jsCompiler = () => {
    return browserify({
        entries: ['./src/js/infiscroll.js'],
        transform: [babelify]
    }).bundle().pipe(source('infiscroll.js')).pipe(buffer()).pipe(jsMinify()).pipe(dest('./dist/js')).pipe(dest('./docs/public/js'));
};

sassCompiler = () => {
    return src('./src/sass/infiscroll.scss').pipe(sass({outputStyle: 'compressed'})
        .on('error', sass.logError)).pipe(dest('./dist/css')).pipe(dest('./docs/public/css'));
};

task('compileJS', () => {
    return jsCompiler().pipe(browserSync.reload({stream: true}));
});

task('compileSass', () => {
    return sassCompiler().pipe(browserSync.reload({stream: true}));
});

task('default', () => {
    browserSync.init({proxy: 'localhost/Html/InfiScroll/docs/', baseDir: './', open: false});
    watch('./src/sass/infiscroll.scss', {ignoreInitial: false}, parallel('compileSass'));
    watch('./src/js/infiscroll.js', {ignoreInitial: false}, parallel('compileJS'));
    watch(['./docs/**/*.php', 'README.md']).on('change', browserSync.reload);
});

task('deploy', () => {
    return jsCompiler() && sassCompiler();
});
