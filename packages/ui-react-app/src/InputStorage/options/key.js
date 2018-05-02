// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StateDb$SectionNames } from '@polkadot/storage/types';

const React = require('react');
const map = require('@polkadot/storage-substrate/keys');

module.exports = function createOptions (sectionName: StateDb$SectionNames): Array<*> {
  const section = map[sectionName];

  return Object
    .keys(section.keys)
    .sort()
    .filter((name) => {
      const { isDeprecated = false, isHidden = false } = section.keys[name];

      return !isDeprecated && !isHidden;
    })
    .map((name) => {
      const { description, params = {} } = section.keys[name];
      const inputs = Object.keys(params).join(', ');

      return {
        className: 'ui--InputStorage-SelectKey-Item',
        text: [
          <div
            className='ui--InputStorage-SelectKey-Item-text'
            key={`${sectionName}:${name}:text`}
          >
            {description || name}
          </div>,
          <div
            className='ui--InputStorage-SelectKey-Item-call'
            key={`${sectionName}:${name}:call`}
          >
            {name}({inputs})
          </div>
        ],
        value: name
      };
    });
};
