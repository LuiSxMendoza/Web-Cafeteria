const { src, dest, watch , parallel } = require('gulp');

//? CSS Y SASS
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//? JavaScript
const concat = require('gulp-concat');

//? Imagenes
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('./build/css') );
}

function javascript() {
    return src(paths.js)
      .pipe(concat('bundle.js')) 
      .pipe(dest('./build/js'))
}

function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3})))
        .pipe(dest('./build/img'))
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe(dest('./build/img'))
}

function versionAvif() {
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif())
        .pipe(dest('./build/img'))
}

function watchArchivos() {
    watch( paths.scss, css );
    watch( paths.js, javascript );
}
  
exports.css = css;
exports.watchArchivos = watchArchivos;
exports.default = parallel(css, javascript, imagenes, versionWebp, versionAvif); 