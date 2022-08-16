// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

const findPackages = require('./scripts/findPackages.cjs');

module.exports = {
  ...config,
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
  setupFilesAfterEnv: ['<rootDir>/jest/setupEnv.cjs'],
  testEnvironment: 'jsdom',
  testTimeout: 90000,
  // NOTE: While we can remove @polkadot/etc. react-markdown still has issues with Jest 28
  // ... TL;DR We still end up with a massive list here
  transformIgnorePatterns: ['/node_modules/(?!react-markdown|vfile|vfile-|unified|unist-|bail|is-plain-obj|trough|remark-parse|mdast-|micromark|decode-named-character-reference|character-entities|remark-rehype|property-information|hast-util-|hast-to-|space-separated-tokens|comma-separated-tokens|rehype-raw|hastscript|web-namespaces|zwitch|html-void-elements|multiformats|is-ipfs|uint8arrays)']
};
