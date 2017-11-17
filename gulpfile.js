// Include modules
const gulp = require('gulp');
const browserSync = require('browser-sync');
// const sass = require('gulp-sass');

// Configure Browsersync
gulp.task('browser-sync', () => {
	const files = ['./public/assets/style.css', './views/layouts/*.hbs', './views/*.hbs', './*.js', './sass/*.scss'];

	// Init Browsersync with a PHP server
	browserSync.init(files, {
		proxy: 'http://localhost:3000'
	});
});

// Create the default task that can be called using gulp.
// The task will process sass, run browser-sync, and start watching for changes.
gulp.task('default', ['browser-sync'], () => {
	gulp.watch('public/assets/style.css');
});
