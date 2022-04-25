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
  setupFilesAfterEnv: ['<rootDir>/jest/jest-setup.ts'],
  testEnvironment: 'jsdom',
  testTimeout: 90000,
  // NOTE Everything after "smoldot" is due to react-markdown being ESM - cannot wait for Jest to
  // finally get this right and work in the modern world. Jest 28 maybe?
  transformIgnorePatterns: ['/node_modules/(?!@polkadot|@babel/runtime/helpers/esm/|@substrate|smoldot|react-markdown|vfile|vfile-|unified|unist-|bail|is-plain-obj|trough|remark-parse|mdast-|micromark|decode-named-character-reference|character-entities|remark-rehype|property-information|hast-util-|hast-to-|space-separated-tokens|comma-separated-tokens|rehype-raw|hastscript|web-namespaces|zwitch|html-void-elements)']
};
