// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Storage$Sections } from '@polkadot/storage/types';
import { DropdownOptions } from '../../util/types';

import React from 'react';

import map from '@polkadot/storage';

export default function createOptions (sectionName: Storage$Sections): DropdownOptions {
  const section = map[sectionName];

  if (!section) {
    return [];
  }

  return Object
    .keys(section.public)
    .sort()
    .filter((name) => {
      const { isDeprecated, isHidden } = section.public[name];

      return !isDeprecated && !isHidden;
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
