const gulp = require('gulp');
const loadAllTasks = require('../index');

describe('gulp-load-all-tasks', () => {
  beforeEach(() => {
    loadAllTasks();
  });

  describe('use default options', () => {
    it('shoud load dummy task', () => {
      const tasks = gulp.tree().nodes;
      expect(tasks.includes('dummy')).toBeTruthy();
    });
  });
});
