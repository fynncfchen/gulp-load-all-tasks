module.exports = {
  root: true,
  extends: ['xo-space/esnext', 'google'],
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    'require-jsdoc': 0,
  },
};
