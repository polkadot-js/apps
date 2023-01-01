// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const config = require('@polkadot/dev/config/jest.cjs');

const findPackages = require('./scripts/findPackages.cjs');

// NOTE: While we can remove @polkadot/... packages such as react-markdown still has issues with Jest 28
  // ... TL;DR We still end up with a massive list here
const ESM_PKG = ['bail', 'character-entities', 'chart.js', 'comma-separated-tokens', 'decode-named-character-reference', 'hast-to-', 'hast-util-', 'hastscript', 'html-void-elements', 'is-plain-obj', 'mdast-', 'micromark', 'multiformats', 'property-information', 'react-markdown', 'rehype-raw', 'remark-parse', 'remark-rehype', 'space-separated-tokens', 'trough', 'uint8arrays', 'unified', 'unist-', 'vfile', 'vfile-', 'web-namespaces', 'zwitch'];

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
  transformIgnorePatterns: [`/node_modules/(?!${ESM_PKG.join('|')})`]
};
