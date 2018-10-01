// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { DropdownOptions } from '../../util/types';

import React from 'react';
// FIXME Swap to dynamic via fromMetadata
import map from '@polkadot/storage/testing';

export default function createOptions (sectionName: keyof typeof map): DropdownOptions {
  const section = map[sectionName];

  if (!section) {
    return [];
  }

  return Object
    .keys(section)
    .sort()
    .map((name) => {
      const method = section[name];
      const type = method.meta.type;
      let input = type.isMap
        ? type.asMap.key.toString()
        : '';

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${name}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${name}:call`}
          >
            {name}({input}): {type.toString()}
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${name}:text`}
          >
            {method.meta.documentation.get(0).toString()}
          </div>
        ],
        value: name
      };
    });
}
