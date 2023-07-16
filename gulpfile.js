import gulp from 'gulp'
import bs from 'browser-sync'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
const sass = gulpSass(dartSass)

const path = {
	src: {
		scss: 'scss/style.scss'
	},
	build: {
		css: 'dist/css'
	},
	watch: {
		html: 'dist/**/*.html',
		scss: 'scss/**/*.scss',
		js: 'dist/**/*.js'
	}
}

function scss() {
	return gulp.src(path.src.scss)
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest(path.build.css))
		.pipe(bs.stream())
}
function server(){
	bs.init({
		server: 'dist',
		notify: false
	})
}
function watch(){
	gulp.watch(path.watch.html).on('change', bs.reload)
	gulp.watch(path.watch.scss, scss)
	gulp.watch(path.watch.js).on('change', bs.reload)
}

gulp.task('default', gulp.series(scss, gulp.parallel(server, watch)))