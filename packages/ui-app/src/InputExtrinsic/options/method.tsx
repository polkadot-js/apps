// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { DropdownOptions } from '../../util/types';

import React from 'react';

import map from '@polkadot/extrinsics';

export default function createOptions (sectionName: string): DropdownOptions {
  const section = map[sectionName];

  if (!section) {
    return [];
  }

  return Object
    .keys(section)
    .sort()
    .map((name) => {
      const method = section[name];
      const inputs = params.map(({ name }) => name).join(', ');

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${name}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${name}:call`}
          >
            {name}({inputs})
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${name}:text`}
          >
            {method.meta.documentation.get(0).toString() || name}
          </div>
        ],
        value: name
      };
    });
}
