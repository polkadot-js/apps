// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicSectionName } from '@polkadot/extrinsics/types';

import React from 'react';
import map from '@polkadot/extrinsics-substrate';

export default function createOptions (sectionName: ExtrinsicSectionName, type: 'private' | 'public'): Array<*> {
  const methods = map[sectionName].methods[type];

  return Object
    .keys(methods)
    .sort()
    .map((name) => {
      const { description, params = {} } = methods[name];
      const inputs = Object.keys(params).join(', ');

      return {
        className: 'ui--InputExtrinsic-SelectMethod-Item',
        key: `${sectionName}_${name}`,
        text: [
          <div
            className='ui--InputExtrinsic-SelectMethod-Item-text'
            key={`${sectionName}_${name}:text`}
          >
            {description || name}
          </div>,
          <div
            className='ui--InputExtrinsic-SelectMethod-Item-call'
            key={`${sectionName}_${name}:call`}
          >
            {name}({inputs})
          </div>
        ],
        value: name
      };
    });
}
