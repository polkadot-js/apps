// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('./jest.config.cjs');

module.exports = {
  ...config,
  displayName: 'all-tests',
  globalSetup: './jest/globalSetup.cjs',
  globalTeardown: './jest/globalTeardown.cjs'
};
