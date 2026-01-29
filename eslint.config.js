// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import baseConfig from '@polkadot/dev/config/eslint';

export default [
  ...baseConfig,
  {
    rules: {
      // add override for any (a metric ton of them, initial conversion)
      '@typescript-eslint/no-explicit-any': 'off',
      // we generally use this in isFunction, not via calling
      '@typescript-eslint/unbound-method': 'off'
    }
  }
];
