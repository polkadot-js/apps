// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DropdownOption, DropdownOptions } from '../../util/types';

import React from 'react';

import map from '@polkadot/jsonrpc';

export default function createOptions (sectionName: string): DropdownOptions {
  const section = map[sectionName];

  if (!section) {
    return [];
  }

  return Object
    .keys(section.methods)
    .sort()
    .filter((value): boolean => {
      const { isDeprecated, isHidden, isSubscription } = section.methods[value];

      return !isDeprecated && !isHidden && !isSubscription;
    })
    .map((value): DropdownOption => {
      const { description, params } = section.methods[value];
      const inputs = params.map(({ name }): string => name).join(', ');

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${value}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${value}:call`}
          >
            {value}({inputs})
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${value}:text`}
          >
            {description || value}
          </div>
        ],
        value
      };
    });
}
