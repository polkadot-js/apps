// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DropdownOptions } from '../../util/types';

import React from 'react';
import Api from '@polkadot/api-observable';

export default function createOptions (sectionName: keyof typeof Api.storage): DropdownOptions {
  const section = Api.storage[sectionName];

  if (!section) {
    return [];
  }

  return Object
    .keys(section)
    .sort()
    .map((value) => {
      const method = section[value];
      const type = method.meta.type;
      let input = type.isMap
        ? type.asMap.key.toString()
        : '';

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${value}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${value}:call`}
          >
            {value}({input}): {type.toString()}
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${value}:text`}
          >
            {(method.meta.documentation[0] || method.meta.name).toString()}
          </div>
        ],
        value
      };
    });
}
