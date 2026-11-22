# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`jasmine-dom-spec` is a library of custom Jasmine matchers for DOM nodes (`toHaveId`, `toBeChecked`, `toHaveCssClass`, …). It supports Jasmine 1.3 through 4.x and ships as a single IIFE bundle (`dist/jasmine-dom-spec.js`) plus hand-written typings.

## Commands

Package manager is **pnpm** (Node version in `.nvmrc`). `pnpm-workspace.yaml` sets `lockfile: false` and `saveExact: true` (pin exact versions), `minimumReleaseAge: 2880` (installing a version published less than 2 days ago fails — pick an older one rather than bypassing it) and a `trustPolicy: no-downgrade` whose known exceptions live in `trustPolicyExclude`.

All npm scripts delegate to gulp tasks defined in `gulpfile.js` → `scripts/<task>/index.js`:

- `pnpm test` — clean + lint + run the full Karma suite once in headless Chrome. If `SAUCE_USERNAME`/`SAUCE_ACCESS_KEY` are set, it runs on SauceLabs instead (that's what CI does).
- `pnpm run tdd` — Karma in watch mode with a real Chrome browser (no lint).
- `pnpm run lint` — ESLint (airbnb-base, max-len 200, `valid-jsdoc` enforced) over root, `scripts/`, `src/`, `test/` (`.js` and `.ts`). Any warning fails the task. Restrict it with `--file` (repeatable; files, directories or globs): `pnpm run lint --file src/core/matchers/to-have-id.js --file test/core/matchers`. A `--file` that matches nothing is an error. `--file` only narrows the standalone `lint` task: `test`, `build` and `release` always lint the whole project (`lint.lint` vs `lint.lintCli` in `gulpfile.js`).
- `pnpm run build` — clean + lint + Rollup bundle to `dist/`, then copy `src/index.d.ts` to `dist/jasmine-dom-spec.d.ts`.
- `pnpm run docs` — regenerate `README.md` (see below).

Run a subset of tests (works with both `test` and `tdd`; pass flags directly, **without** a `--` separator, or pnpm forwards the `--` to gulp and it fails with "Task never defined"):

```bash
pnpm test --file test/core/matchers/to-have-id.spec.js       # one spec file instead of test/index.js (repeatable, globs allowed)
pnpm test --filter "should pass without parameter"            # only specs whose full name ("describe it") matches
pnpm test --filter "/^toHaveId should pass/"                  # /regex/flags is supported
pnpm test --file=test/core/it/to-have-id.spec.js --filter "without parameter"   # combine both
pnpm run tdd --file test/core/util/trim.spec.js               # watch mode on a single file, no lint
```

`--file` replaces Karma's `files`/`preprocessors`; `--filter` is forwarded to karma-jasmine as `--grep`. Both flags are parsed once in `scripts/cli/index.js` (`readCliOptions`, Node's `util.parseArgs`, paths resolved against the repo root) and shared by the lint and test tasks; they apply to every Karma mode. Note that `pnpm test --file x` still lints the whole project first — use `pnpm run tdd --file x` to skip lint.

## Architecture

**Entry point** `src/index.js`: wraps every export of `src/core/matchers/index.js` with `createMatcher` and registers them in a global `beforeEach` (`this.addMatchers` on Jasmine 1, `jasmine.addMatchers` otherwise). Importing the bundle is enough to install the matchers.

**Matchers are Jasmine-version-agnostic.** Each matcher in `src/core/matchers/` is a plain function `(ctx, ...args) => { pass, message() }`, where `ctx` is `{ actual, isNot, equals, pp }`. The adapters in `src/core/jasmine/j{1,2,3,4}-matcher-factory.js` (selected by `version.js`, which reads the global `jasmine.version`) translate this into each Jasmine API's shape, supplying `equals`/`pp` from that Jasmine's utilities.

**Messages** contain a `[NOT]` placeholder (e.g. `Expect [actual] [NOT] to have id ...`); `negate-message.js` replaces it with `not` or removes it depending on positive/negative comparison. Matchers must not handle negation themselves.

**`src/core/util/`** holds small ES5-friendly helpers (`forEach`, `keys`, `isX` predicates, `toDomElement`, `matchOrEquals`, …). Prefer these over native/modern APIs — the bundle is transpiled with Babel but no polyfills are included, and tests run against old browsers (IE11, old Safari) on SauceLabs. `toDomElement` normalizes `actual` and accepts: a DOM node, an HTML string (parsed), a single-element NodeList/array-like (jQuery included; empty or multi-node collections throw), an Angular `DebugElement` (`.nativeElement`), a Vue test-utils wrapper (`.element`) or a React Testing Library render result (`.baseElement`) — anything else throws `Expect DOM node but found: …`. Support for a new wrapper goes in its `unwrapFunctions` list.

**Invalid input throws instead of failing.** Besides `toDomElement`, matchers that read an element-specific property (`toBeChecked`, `toBeDisabled`, `toHaveValue`, `toBeSelected`, …) call `ensureHasIn` (`src/core/preconditions/`), which throws when the node lacks it (e.g. `toBeChecked` on a `<div>`). These throw even under `.not`, so test them with `toThrowError`, not as a failing/passing assertion.

Also in `util/`: `matchOrEquals` handles strings, RegExps and Jasmine asymmetric matchers (`jasmine.any(...)`).

### Adding or changing a matcher

A matcher touches several places that must stay in sync:
1. `src/core/matchers/<kebab-name>.js` — the function, with a JSDoc block using `@message`, `@example`, `@param`, `@return`, `@since`. **This JSDoc is the source of the README**: `pnpm run docs` parses it with `dox` and renders `.readme` (a Handlebars template) into `README.md`. Edit `.readme` or the JSDoc, never `README.md` directly — it is fully regenerated (including on every release), so hand edits are lost. The `docs` task logs errors but still finishes successfully, so check its output and `git diff README.md` after running it.
2. Export it from `src/core/matchers/index.js`.
3. Add its signature to the `jasmine.Matchers<T>` interface in `src/index.d.ts`.
4. Tests (see below), each imported from the matching folder's `index.js`.

## Tests

Tests are ES modules bundled by `karma-rollup-preprocessor` from a single entry, `test/index.js` → `test/core/index.js` → each folder's `index.js`. **A new spec file is only run by the full suite if it is imported from its folder's `index.js`** (running it alone with `--file` works either way, so don't use that to check it's wired in).

- `test/core/matchers/` — unit tests calling the matcher function directly with a fake context from `test/core/test/create-fake-context.js`; they assert on `pass` and on the raw message (still containing `[NOT]`).
- `test/core/it/` — integration tests that `import '../../../src/index'` and use the real `expect(node).toX()` API.
- `test/core/jasmine/`, `test/core/util/`, `test/core/preconditions/` — unit tests for adapters and helpers.
- `test/core/test/` — helpers. `createFakeContext(actual, { equals, pp })` defaults `equals` to a strict `===` spy (not Jasmine's deep equality), so pass a custom `equals` when a spec relies on `jasmine.any(...)` or object equality. `assumeNotIE()` / `skip(message, predicate)` call `pending()` to skip browser-specific specs.

Tests run with `jasmine-core` 3.x from devDependencies; the 1/2/4 adapters are covered by their own unit specs.

## Release

Releases run from the GitHub "Release" workflow (`pnpm run release:{patch,minor,major}`): test, build, docs, bump `package.json` + `bower.json`, force-add `dist/` and commit, tag, then `git rm` `dist/` in a follow-up commit. `dist/` is therefore only committed on release tags — don't commit build output otherwise. Publishing to npm is a separate "Publish" workflow that checks out a tag.

## Conventions

- Every source file starts with the MIT license header; keep it on new files.
- Commit messages use Conventional Commit prefixes: `feat:`, `fix:`, `refactor:`, `chore:`, `chore(ci):` (`chore(deps-dev):` is Dependabot's, `release:` is reserved for the release workflow).
