const base = require('@polkadot/dev/config/eslint');

// add override for any (a metric ton of them, initial conversion)
module.exports = {
  ...base,
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.json'
    ]
  },
  rules: {
    ...base.rules,
    '@typescript-eslint/no-explicit-any': 'off',
    'header/header': [2, 'line', [
      { pattern: ' Copyright \\d{4}(-\\d{4})? @canvas-ui/' },
      ' SPDX-License-Identifier: Apache-2.0'
    ]],
  }
};
