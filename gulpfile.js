var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('sass', function(){
    return gulp.src('app/stylesheets/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('app/css'))
});

gulp.task("build", ["sass"], function(callback){

});

//watch multiple files at once
gulp.task('watch', function(){
    gulp.watch('app/stylesheets/*/scss', ['sass']);
});

//builds
