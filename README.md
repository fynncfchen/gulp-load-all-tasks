# gulp-load-all-tasks

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Coverage percentage][coveralls-image]][coveralls-url]

> One folder, all tasks. \
> Inspired by [gulp-task-loader][gulp-task-loader].

## Getting Started

### Prerequisites

Please make sure you're using [gulp][gulp4.0] version 4.0
or follow this [guildline][gulp-upgrade] to upgrade.

Use [NPM](https://docs.npmjs.com/cli/install).

```sh
npm install -g gulp-cli
npm install --save-dev gulpjs/gulp#4.0
```

Use [Yarn](https://yarnpkg.com/en/docs/usage). ([Installation](https://yarnpkg.com/lang/en/docs/install/#mac-tab))

```sh
yarn global add gulp-cli
yarn add --dev gulpjs/gulp#4.0
```

Check your gulp version.

```sh
gulp -v
```

You might get result like this:

```sh
CLI version 1.4.0
Local version 4.0.0-alpha.2
```

### Install

By NPM:

```sh
npm install --save-dev gulp-load-all-tasks
```

By Yarn:

```sh
yarn add --dev gulp-load-all-tasks
```

## Usage

1.  Create a folder named 'gulp-tasks' or whatever you like.
1.  Create a task definition file.
1.  Require this module and invoke it.
1.  All tasks are loaded.

You can also create subfolders to organize your tasks as sub-tasks.
All sub-tasks will named with prefix by folder name.

For example, if the structure of your `gulp-tasks` are:

```
.
├── build
│   ├── pug.js
│   └── sass.js
├── build.js
├── watch.js
└── deploy.js
```

And you'll see your tasks list:

```
gulp --tasks

Tasks for guipfile.js
├── build:pug
├── build:sass
├── build
├── deploy
└── watch
```

### Examples

#### Task definition file

```javascript
// gulp-tasks/copy.js
module.exports = function() {
  return gulp.src('src/**/*')
    pipe(gulp.dest('dist/**/*'))
};
```

```javascript
// Load all tasks from default folder 'gulp-tasks'
require('gulp-load-all-tasks')();

// Run the task
gulp.task('default', gulp.series('copy', (done) => {
  console.log('Task done');
  done();
}))
```

#### Task with dependencies

```javascript
// gulp-tasks/copy.js
const del = require('del');

module.exports = function() {
  return gulp.src('src/**/*')
    pipe(gulp.dest('dist/**/*'))
};
module.exports.dependencies = gulp.series('clean');
```

#### Load tasks by default folder

```javascript
require('gulp-load-all-tasks')();
```

#### Load module by [`gulp-load-plugins`](https://github.com/jackfranklin/gulp-load-plugins)

```javascript
const $ = require('gulp-load-plugins')();
$.loadAllTasks();
```

#### Load tasks by Different folder name

```javascript
require('gulp-load-all-tasks')('my-tasks');
```

#### Load tasks in other extensions

```javascript
require('gulp-load-all-tasks')({
  exts: ['.coffee'],
});
```

#### Task context

Each task will binding a context object with reference to `gulp`
and `context`.

```javascript
// gulpfile.js
const browserSync = require('browser-sync').create();
require('gulp-load-all-tasks')({
  browserSync,
});

// gulp-tasks/pug.js
const $ = require('gulp-load-plugins')();

module.exports = function() {
  const gulp = this.gulp;
  const browserSync = this.context.browserSync;

  return gulp.src('src/pug/**/*')
    .pipe($.pug())
    .pipe(gulp.dest('dist')
    .pipe(browserSync.stream());
};
```

#### Forward Reference Support

If you got the error:

```sh
AssertionError: Task never defined: <task>
```

All the tasks are loaded by gulp alphabetically, it'll cause
some of your task dependencies are loaded before it defined.

You can add [`undertaker-forward-reference`](https://github.com/gulpjs/undertaker-forward-reference)
as your gulp task registry.

```javascript
const ForwardReference = require('undertaker-forward-reference');
const loadAllTasks = require('gulp-load-all-tasks');

gulp.registry(new ForwardReference());

loadAllTasks({
  // Context...
});
```

## Options

### dir

Type: `String`

Default: `gulp-tasks`

Folder path with all task files.

### extensions

Type: `Array`

Default: keys of `require.extensions`

Task file extensions.

## License

MIT © [ethancfchen](https://github.com/ethancfchen)

[npm-image]: https://badge.fury.io/js/gulp-load-all-tasks.svg
[npm-url]: https://npmjs.org/package/gulp-load-all-tasks
[travis-image]: https://travis-ci.org/ethancfchen/gulp-load-all-tasks.svg?branch=master
[travis-url]: https://travis-ci.org/ethancfchen/gulp-load-all-tasks
[daviddm-image]: https://david-dm.org/ethancfchen/gulp-load-all-tasks.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ethancfchen/gulp-load-all-tasks
[coveralls-image]: https://coveralls.io/repos/ethancfchen/gulp-load-all-tasks/badge.svg
[coveralls-url]: https://coveralls.io/r/ethancfchen/gulp-load-all-tasks

[gulp4.0]: https://github.com/gulpjs/gulp/tree/4.0/docs/
[gulp-upgrade]: https://www.liquidlight.co.uk/blog/article/how-do-i-update-to-gulp-4/
[gulp-task-loader]: https://github.com/hontas/gulp-task-loader/
