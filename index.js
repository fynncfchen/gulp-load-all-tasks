const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const assign = require('object-assign');

const PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-load-all-tasks';

function loadAllTasks(options) {
  if (typeof options === 'string') {
    options = {dir: options};
  }

  if (options && options.dir) {
    options.dir = options.dir
      .replace(/^\.\//, '')
      .replace(/\/$/, '');
  }

  const config = assign({
    dir: 'gulp-tasks',
    exts: Object.keys(require.extensions) || ['.js'],
  }, options);

  function loadTask(parents, taskFile) {
    const taskPath =
      path.join(process.cwd(), config.dir,
        parents.join(path.sep) || '', taskFile);
    const taskFunction = require(taskPath);
    const dependencies = taskFunction.dependencies;
    const taskContext = {
      gulp,
      context: config,
    };
    let taskName = path.basename(taskFile, path.extname(taskFile));

    if (parents.length) {
      taskName = parents.join(':') + ':' + taskName;
    }

    if (dependencies instanceof Array) {
      throw new PluginError(PLUGIN_NAME,
        'Please define dependencies using ' +
        '\'gulp.series\' or \'gulp.parallel\'.');
    }

    if (dependencies) {
      gulp.task(taskName, dependencies, taskFunction.bind(taskContext));
    } else {
      gulp.task(taskName, taskFunction.bind(taskContext));
    }
  }

  function loadTasks(filePath) {
    const filename = path.basename(filePath);
    const file = fs.lstatSync(filePath);
    if (file.isFile() && config.exts.indexOf(path.extname(filename)) !== -1) {
      loadTask(
        filePath.split(path.sep)
          .slice(config.dir.split(path.sep).length, -1), filename);
    } else if (file.isDirectory()) {
      fs.readdirSync(filePath)
        .forEach((subPath) => {
          loadTasks(path.join(filePath, subPath));
        });
    }
  }

  loadTasks(config.dir);
}

module.exports = loadAllTasks;
