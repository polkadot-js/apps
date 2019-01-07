// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DropdownOptions } from '../../util/types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';

export default function createOptions (apiPromise: ApiPromise, sectionName: string): DropdownOptions {
  const section = apiPromise.query[sectionName];

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
