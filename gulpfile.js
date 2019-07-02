let gulp=require('gulp');
let uglify = require('gulp-uglify-es').default;
let concat = require('gulp-concat');
let plumber = require('gulp-plumber');
const minify = require('gulp-minify');
 
gulp.task('compress', function() {
  gulp.src(['scripts/*.js'])
    .pipe(minify())
    .pipe(gulp.dest('build'))
});

gulp.task('js', function() {
    return gulp.src('scripts/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('build'))
});

gulp.task('watch', function() {
    gulp.watch('*.js', ['js']);
});
