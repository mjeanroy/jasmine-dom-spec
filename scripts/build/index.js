/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2024 Mickael Jeanroy
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

const path = require('node:path');
const gulp = require('gulp');
const rename = require('gulp-rename');
const rollup = require('rollup');
const rollupConf = require('./rollup.conf');
const log = require('../log');
const config = require('../config');

/**
 * Generate final bundle.
 *
 * @return {Promise} The promise, resolved when bundle is written to disk.
 */
function bundle() {
  log.debug('Generating rollup bundle');
  return rollup
    .rollup(rollupConf)
    .then((bundleOutput) => bundleOutput.write(rollupConf.output));
}

/**
 * Copy typings to final destination.
 *
 * @return {Stream} The stream pipeline.
 */
function typings() {
  const input = config.entry;
  const output = config.dest;

  const inputName = path.basename(input, '.js');
  const outputName = path.basename(output, '.js');

  const src = `${inputName}.d.ts`;
  const dest = `${outputName}.d.ts`;

  log.debug(`Copy typings from ${src} to ${dest}`);

  return gulp.src(path.join(config.src, src))
    .pipe(rename(dest))
    .pipe(gulp.dest(config.dist));
}

module.exports = gulp.series(
  bundle,
  typings,
);
