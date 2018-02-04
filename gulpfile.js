/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014-2018 Mickael Jeanroy
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
const fs = require('fs');
const _ = require('lodash');
const del = require('del');
const rollup = require('rollup');
const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const eslint = require('gulp-eslint');
const KarmaServer = require('karma').Server;
const git = require('gulp-git');
const bump = require('gulp-bump');
const tagVersion = require('gulp-tag-version');
const glob = require('glob');
const touch = require('touch');
const Q = require('q');
const Handlebars = require('handlebars');
const dox = require('dox');
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

gulp.task('saucelab', (done) => {
  startKarma('saucelab', done);
});

gulp.task('travis', (done) => {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    log(colors.grey('SauceLab environment not set, running classic test suite'));
    startKarma('test', done);
  } else {
    startKarma('saucelab', done);
  }
});

gulp.task('build', ['clean'], () => {
  return rollup
    .rollup(rollupConf)
    .then((bundle) => {
      return bundle.write(rollupConf.output);
    });
});

// Release tasks
['minor', 'major', 'patch'].forEach((level) => {
  const PKG_JSON = path.join(conf.root, 'package.json');
  const BOWER_JSON = path.join(conf.root, 'bower.json');
  const README = path.join(conf.root, 'README.md');
  const DIST = conf.dist;

  gulp.task(`bump:${level}`, () => (
    gulp.src([PKG_JSON, BOWER_JSON])
      .pipe(bump({type: level}))
      .pipe(gulp.dest(conf.root))
  ));

  gulp.task(`release:prepare:${level}`, ['build', 'docs', `bump:${level}`], () => (
    gulp.src([DIST, PKG_JSON, BOWER_JSON, README])
      .pipe(git.add({args: '-f'}))
      .pipe(git.commit('release: release version'))
  ));

  gulp.task(`tag:${level}`, [`release:prepare:${level}`], () => (
    gulp.src([PKG_JSON]).pipe(tagVersion())
  ));

  gulp.task(`release:${level}`, ['build', 'docs', `tag:${level}`], () => (
    gulp.src([DIST])
      .pipe(git.rm({args: '-rf'}))
      .pipe(git.commit('release: prepare next release'))
  ));
});

gulp.task('release', ['release:minor']);

gulp.task('docs', (done) => {
  listFiles(path.join(conf.src, 'core', 'matchers'))
    // Read JSDoc
    .then((files) => {
      return Q.all(_.map(files, (file) => readFile(file)
        .then((content) => dox.parseComments(content, {raw: true}))
        .then((jsdoc) => keepFunctions(jsdoc))
        .then((api) => parseComments(api))
      ));
    })

    // Generate Markdown
    .then((comments) => {
      return readFile(path.join(conf.root, '.readme'))
        .then((template) => Handlebars.compile(template, {noEscape: true}))
        .then((templateFn) => templateFn({
          matchers: _.map(comments, (comment) => comment[0]),
        }));
    })

    // Write Markdown
    .then((result) => (
      writeFile(path.join(conf.root, 'README.md'), result))
    )

    .catch((err) => {
      log(colors.red(`Error occured while generating documentation: ${err}`));
    })

    .finally(() => {
      done();
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
    log(colors.grey('Calling done callback of Karma'));
    done();
  });

  log(colors.grey(`Running karma with configuration: ${fileName}`));
  karma.start();
}

/**
 * List all files in a directory asynchronously.
 * This function returns a promise resolved with the list of files in the
 * directory or rejected with the error.
 *
 * @param {string} dir The directory.
 * @returns {Promise} The promise.
 */
function listFiles(dir) {
  const deferred = Q.defer();

  glob(path.join(dir, '**', '*.js'), (err, files) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(_.chain(files)
        .reject((f) => path.basename(f) === 'index.js')
        .sortBy((f) => path.basename(f))
        .value());
    }
  });

  return deferred.promise;
}

/**
 * Read a file asynchronously.
 * This function returns a promise resolved with the file content or rejected with
 * the error.
 *
 * @param {string} file The full path.
 * @return {Promise} The promise.
 */
function readFile(file) {
  const deferred = Q.defer();

  log(colors.grey(`Reading: ${file}`));

  fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
}

/**
 * Write a file asynchronously.
 * This function returns a promise resolved when the file is successfully written
 * or rejected with the error.
 *
 * @param {string} file The full path.
 * @param {string} content File content.
 * @return {Promise} The promise.
 */
function writeFile(file, content) {
  const deferred = Q.defer();

  log(colors.grey(`Writing: ${file}`));

  touch(file, (err) => {
    if (err) {
      deferred.reject(err);
    } else {
      fs.writeFile(file, content, 'utf-8', (err, data) => {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve();
        }
      });
    }
  });

  return deferred.promise;
}

/**
 * Filter a list of comments object to keep only functions.
 *
 * @param {Array<Object>} comments List of comments.
 * @returns {Array<Object>} The array containing only jsdoc of functions.
 */
function keepFunctions(comments) {
  return _.filter(comments, (comment) => (
    !!comment.ctx && comment.ctx.type === 'function'
  ));
}

/**
 * Trim all lines in a block of text.
 *
 * @param {string} txt Block of text.
 * @return {string} The same text with all lines trimmed.
 */
function trimAll(txt) {
  const lines = txt.split('\n');
  const trimmedLines = _.map(lines, _.trim);
  return trimmedLines.join('\n');
}

/**
 * Parse a comments block object to keep only interesting information to use
 * in the documentation template.
 *
 * @param {Array<Object>} comments Comments.
 * @returns {Array<Object>} The new comments.
 */
function parseComments(comments) {
  return _.map(comments, (comment) => {
    const tags = _.groupBy(comment.tags, 'type');
    return {
      name: comment.ctx.name,
      description: _.trim(comment.description.full),
      code: comment.code,

      since: _(tags.since)
        .map('string')
        .map(trimAll)
        .value()[0],

      messages: _(tags.message)
        .map('string')
        .map(trimAll)
        .value(),

      examples: _(tags.example)
        .map('string')
        .flatMap((x) => x.split('\n'))
        .map(trimAll)
        .value(),

      params: _(tags.param)
        .slice(1)
        .map((param) => _.assign(param, {types: _.isEmpty(param.types) ? ['*'] : param.types}))
        .value(),
    };
  });
}
