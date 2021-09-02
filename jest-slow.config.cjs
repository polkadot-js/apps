// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('./jest.config.cjs');

module.exports = {
  ...config,
  displayName: 'all-tests',
  globalSetup: './jest/globalSetup.ts',
  globalTeardown: './jest/globalTeardown.ts'
};
