/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2017 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

const path = require('path');
const del = require('del');
const rollup = require('rollup');
const gulp = require('gulp');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const KarmaServer = require('karma').Server;
const rollupConf = require('./rollup.conf');
const conf = require('./conf');

gulp.task('clean', () => {
  return del([
    conf.dist,
  ]);
});

gulp.task('lint', () => {
  const sources = [
    path.join(conf.src, '**', '*.js'),
    path.join(conf.test, '**', '*.js'),
    path.join(conf.root, '*.js'),
  ];

  return gulp.src(sources)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', (done) => {
  startKarma('test', done);
});

gulp.task('tdd', (done) => {
  startKarma('tdd', done);
});

gulp.task('build', ['clean'], () => {
  return rollup
    .rollup(rollupConf)
    .then((bundle) => {
      return bundle.write(rollupConf.output);
    });
});

/**
 * Start Karma Server and run unit tests.
 *
 * @param {string} mode The test mode (test or tdd).
 * @param {function} done The done callback.
 * @return {void}
 */
function startKarma(mode, done) {
  const fileName = `karma.${mode}.conf.js`;
  const configFile = path.join(conf.root, fileName);

  const karma = new KarmaServer({configFile}, () => {
    gutil.log(gutil.colors.grey('Calling done callback of Karma'));
    done();
  });

  gutil.log(gutil.colors.grey(`Running karma with configuration: ${fileName}`));
  karma.start();
}
