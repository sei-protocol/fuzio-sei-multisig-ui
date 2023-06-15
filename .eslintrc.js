/* global module */
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:canonical/recommended', 'canonical/prettier'],
  globals: {
    process: 'readonly',
  },
  overrides: [
    {
      extends: ['canonical/jsx-a11y'],
      files: '*.tsx',
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['canonical'],
};
