import { deleteSync } from "del";
import dartSass from "sass";
import gulgSass from "gulp-sass";
import gulp from "gulp";
import csso from "gulp-csso";
import include from "gulp-file-include";
import htmlmin from "gulp-htmlmin";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import sync from "browser-sync";


const sass = gulgSass(dartSass);

sync.create();

export function html() {
  return gulp
    .src("src/**.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest("dist"));
}

export function scss() {
  return gulp
    .src("src/scss/**.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(csso())
    .pipe(concat("styles.css"))
    .pipe(gulp.dest("dist/css"));
}

export function images() {
  return gulp.src("src/images/**/*.*").pipe(gulp.dest("dist/images"));
}
export function fonts() {
  return gulp.src("src/fonts/**/*.{woff,woff2}").pipe(gulp.dest("dist/fonts"));
}
export async function clear() {
  return deleteSync("dist");
}

function watch() {
  sync.init({
    server: "./dist",
  });
  gulp.watch("src/**.html", gulp.series(html)).on("change", sync.reload);
  gulp.watch("src/scss/**.scss", gulp.series(scss)).on("change", sync.reload);
  gulp.watch("src/images/**/*.*", gulp.series(images));
}

export const build = gulp.series(clear,fonts, images, html, scss);

export const serve = gulp.series(build, watch);
