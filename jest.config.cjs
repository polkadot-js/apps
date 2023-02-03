// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

const findPackages = require('./scripts/findPackages.cjs');

// NOTE: While we can remove @polkadot/... packages such as react-markdown still has issues with Jest 28
  // ... TL;DR We still end up with a massive list here
const ESM_PKG = [
  // general packages
  'bail', 'character-entities', 'chart.js', 'comma-separated-tokens', 'decode-named-character-reference', 'decode-uri-component', 'filter-obj', 'hast-to-', 'hast-util-', 'hastscript', 'html-void-elements', 'is-ipfs', 'is-plain-obj', 'mdast-', 'micromark', 'multiformats', 'property-information', 'query-string', 'react-markdown', 'rehype-raw', 'remark-parse', 'remark-rehype', 'space-separated-tokens', 'split-on-first', 'trough', 'uint8arrays', 'unified', 'unist-', 'vfile', 'vfile-', 'web-namespaces', 'zwitch',
  // type packages
  '@logion/node-api'
];

// Jest does not support import maps... more issues
const MAP_ESM = {
  'is-ipfs': '<rootDir>/node_modules/is-ipfs/dist/src/index.js',
  'multiformats/basics': '<rootDir>/node_modules/multiformats/src/basics.js',
  'multiformats': '<rootDir>/node_modules/multiformats/src/index.js',
  'uint8arrays/to-string': '<rootDir>/node_modules/uint8arrays/src/to-string.js'
}

// file mapping
const MAP_FILE = {
  '\\.(css|less)$': 'empty/object',
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'empty/object',
  '\\.(md)$': '<rootDir>/jest/mocks/empty.js'
}

module.exports = {
  ...config,
  moduleNameMapper: {
    ...MAP_ESM,
    ...MAP_FILE,
    ...(
      findPackages()
        .filter(({ name }) => !['@polkadot/apps'].includes(name))
        .reduce((modules, { dir, name }) => {
          modules[`${name}(.*)$`] = `<rootDir>/packages/${dir}/src/$1`;

          return modules;
        }, {})
    ),
    '@polkadot/apps/(.*)$': '<rootDir>/packages/apps/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setupEnv.cjs'],
  testEnvironment: 'jsdom',
  testTimeout: 90000,
  transformIgnorePatterns: [`/node_modules/(?!${ESM_PKG.join('|')})`]
};
