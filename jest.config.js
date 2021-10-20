// Copyright 2017-2021 @polkadot/app authors & contributors
// and @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

const findPackages = require('./scripts/findPackages');

const internalModules = findPackages()
  .filter(({ name }) => !['@canvas-ui/app'].includes(name))
  .reduce((modules, { dir, name }) => {
    modules[`${name}(.*)$`] = `<rootDir>/packages/${dir}/src/$1`;

    return modules;
  }, {});

module.exports = Object.assign({}, config, {
  moduleNameMapper: {
    ...internalModules,
    '\\.(css|less)$': 'empty/object',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules'
  ]
});
