var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');

gulp.task('default', ['server', 'nodemon'], function () {
	gulp.watch('src/**/*.js', ['server'])
})


gulp.task('server', function() {
	gulp.src('src/**/*.js')
		.pipe(babel({
			presets: ['env'],
			plugins: ['transform-object-rest-spread']
		}))
		// .pipe(concat('server.js'))
		.pipe(gulp.dest('dist'))
});

gulp.task('nodemon', function () {
	nodemon({
		script: 'dist/server.js',
		ext: 'js html'
	})
})
