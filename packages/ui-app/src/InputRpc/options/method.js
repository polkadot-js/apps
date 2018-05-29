// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Interface$Sections } from '@polkadot/jsonrpc/types';
import type { DropdownOptions } from '../../InputExtrinsic/types';

import React from 'react';

import map from '@polkadot/jsonrpc';

export default function createOptions (sectionName: Interface$Sections): DropdownOptions {
  const section = map[sectionName];

  if (!section) {
    return [];
  }

  return Object
    .keys(section.public)
    .sort()
    .filter((name) => {
      const { isDeprecated, isHidden, isSubscription } = section.public[name];

      return !isDeprecated && !isHidden && !isSubscription;
    })
    .map((name) => {
      const { description, params } = section.public[name];
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
            {description || name}
          </div>
        ],
        value: name
      };
    });
}
