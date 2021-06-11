// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

const findPackages = require('./scripts/findPackages.cjs');

const defaultConfig = {
  moduleNameMapper: {
    ...(
      findPackages()
        .filter(({ name }) => !['@polkadot/apps'].includes(name))
        .reduce((modules, { dir, name }) => {
          modules[`${name}(.*)$`] = `<rootDir>/packages/${dir}/src/$1`;

          return modules;
        }, {})
    ),
    '@polkadot/apps/(.*)$': '<rootDir>/packages/apps/src/$1',
    '\\.(css|less)$': 'empty/object',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
    '\\.(md)$': '<rootDir>/jest/mocks/empty.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest/jest-setup.ts'],
  transformIgnorePatterns: ['/node_modules/(?!@polkadot|@babel/runtime/helpers/esm/)']
};

module.exports = {
  ...config,
  projects: [
    {
      ...defaultConfig,
      displayName: 'all-tests',
      globalSetup: './jest/globalSetup.ts',
      globalTeardown: './jest/globalTeardown.ts'
    },
    {
      ...defaultConfig,
      displayName: 'fast-tests'
    }
  ],
  testTimeout: 25000
};
