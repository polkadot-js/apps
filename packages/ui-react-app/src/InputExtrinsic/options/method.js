// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicSectionName } from '@polkadot/extrinsics/types';

const React = require('react');
const map = require('@polkadot/extrinsics-substrate');

module.exports = function createOptions (sectionName: ExtrinsicSectionName, type: 'private' | 'public'): Array<*> {
  const methods = map[sectionName].methods[type];

  return Object
    .keys(methods)
    .sort()
    .map((name) => {
      const { description, params = {} } = methods[name];
      const inputs = Object.keys(params).join(', ');

      return {
        className: 'ui--InputExtrinsic-SelectMethod-Item',
        text: [
          <div
            className='ui--InputExtrinsic-SelectMethod-Item-text'
            key={`${sectionName}:${name}:text`}
          >
            {description || name}
          </div>,
          <div
            className='ui--InputExtrinsic-SelectMethod-Item-call'
            key={`${sectionName}:${name}:call`}
          >
            {name}({inputs})
          </div>
        ],
        value: name
      };
    });
};
