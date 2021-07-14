// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const base = require('@polkadot/dev/config/eslint.cjs');

// add override for any (a metric ton of them, initial conversion)
module.exports = {
  ...base,
  ignorePatterns: [
    '.eslintrc.cjs',
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
    '@typescript-eslint/unbound-method': 'off'
  }
};
