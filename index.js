const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const assign = require('object-assign');

function cleanDir(options) {
  if (!options.dir) return;
  options.dir = options.dir
    .replace(/^\.\//, '')
    .replace(/\/$/, '');
}

module.exports = function(options) {
  if (typeof options === 'string') {
    options = {dir: options};
  }

  if (options) {
    cleanDir(options);
  }

  const opts = assign({
    dir: 'gulp-tasks',
    exts: Object.keys(require.extensions) || ['.js'],
  }, options);

  function byExtension(fileName) {
    const extension = path.extname(fileName);
    return opts.exts.indexOf(extension) !== -1;
  }

  function stripExtension(fileName) {
    const extension = path.extname(fileName);
    return path.basename(fileName, extension);
  }

  function loadTask(parents, task) {
    const modulePath = path.join(
      process.cwd(), opts.dir, parents.join(path.sep) || '', task);
    const func = require(modulePath);
    let taskName = stripExtension(task);
    const context = {
      gulp,
      opts,
    };

    // If subtask -> namespace: "parent:child"
    if (parents.length) {
      taskName = parents.join(':') + ':' + taskName;
    }

    gulp.task(taskName, func.bind(context));
  }

  function loadTasks(currentPath) {
    const file = path.basename(currentPath);
    const stats = fs.lstatSync(currentPath);

    if (stats.isFile() && byExtension(file)) {
      loadTask(
        currentPath
          .split(path.sep)
          .slice(opts.dir.split(path.sep).length, -1), file);
    } else if (stats.isDirectory()) {
      fs.readdirSync(currentPath)
        .forEach((subPath) => {
          loadTasks(path.join(currentPath, subPath));
        });
    }
  }

  loadTasks(opts.dir);
};
