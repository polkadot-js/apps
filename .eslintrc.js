// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
    // needs to be switched on at some point
    '@typescript-eslint/no-explicit-any': 'off',
    // this seems very broken atm, false positives
    '@typescript-eslint/unbound-method': 'off'
  }
};
