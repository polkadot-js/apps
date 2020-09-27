// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest');

const findPackages = require('./scripts/findPackages');

const internalModules = findPackages()
  .filter(({ name }) => !['@polkadot/apps'].includes(name))
  .reduce((modules, { dir, name }) => {
    modules[`${name}(.*)$`] = `<rootDir>/packages/${dir}/src/$1`;

    return modules;
  }, {});

const defaultConfig = {
  moduleNameMapper: {
    ...internalModules,
    '\\.(css|less)$': 'empty/object',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
    '\\.(md)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testTimeout: 25000,
  transformIgnorePatterns: [
    '<rootDir>/node_modules'
  ]
};

module.exports = Object.assign({}, config, {
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
  ]
});
