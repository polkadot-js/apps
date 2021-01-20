// Copyright 2017-2021 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const base = require('@polkadot/dev/config/eslint.cjs');

// add override for any (a metric ton of them, initial conversion)
module.exports = {
  ...base,
  plugins: [...base.plugins, 'simple-import-sort'],
  ignorePatterns: [
    '.eslintrc.js',
    '.github/**',
    '.vscode/**',
    '.yarn/**',
    '**/build/*',
    '**/coverage/*',
    '**/node_modules/*'
  ],
  parserOptions: {
    ...base.parserOptions,
    project: [
      './tsconfig.json'
    ]
  },
  rules: {
    ...base.rules,
    // needs to be switched on at some point
    '@typescript-eslint/no-explicit-any': 'off',
    // this seems very broken atm, false positives
    '@typescript-eslint/unbound-method': 'off',
    'header/header': [2, 'line', [
      { pattern: ' Copyright \\d{4}(-\\d{4})? @canvas-ui/' },
      ' SPDX-License-Identifier: Apache-2.0'
    ]],
  }
};
